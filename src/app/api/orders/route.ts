import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { slug, buyerName, buyerEmail, buyerPhone, items } = body;

  if (!slug || !buyerName || !buyerEmail || !items?.length) {
    return NextResponse.json({ error: "Saknade fält" }, { status: 400 });
  }

  const group = await db.group.findUnique({ where: { slug }, include: { campaigns: { where: { status: "ACTIVE" }, take: 1 } } });
  if (!group) return NextResponse.json({ error: "Gruppen hittades inte" }, { status: 404 });

  // Hämta eller skapa köparen
  let user = await db.user.findUnique({ where: { email: buyerEmail } });
  if (!user) {
    user = await db.user.create({
      data: { email: buyerEmail, name: buyerName, role: "BUYER", groupId: group.id },
    });
  }

  // Hämta produkterna och beräkna total
  const productIds: string[] = items.map((i: { id: string }) => i.id);
  const products = await db.product.findMany({ where: { id: { in: productIds } } });

  const total = items.reduce((sum: number, item: { id: string; qty: number }) => {
    const product = products.find((p) => p.id === item.id);
    return sum + (product?.sellPrice ?? 0) * item.qty;
  }, 0);

  const order = await db.order.create({
    data: {
      groupId: group.id,
      userId: user.id,
      campaignId: group.campaigns[0]?.id ?? null,
      total,
      status: "PENDING",
      items: {
        create: items.map((item: { id: string; qty: number }) => {
          const product = products.find((p) => p.id === item.id)!;
          return { productId: item.id, quantity: item.qty, price: product.sellPrice };
        }),
      },
    },
  });

  return NextResponse.json({ orderId: order.id }, { status: 201 });
}
