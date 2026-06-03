import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.groupId) {
    return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });
  }

  const groupId = session.user.groupId;

  const [group, orders, campaign] = await Promise.all([
    db.group.findUnique({ where: { id: groupId } }),
    db.order.findMany({
      where: { groupId },
      include: { items: true, user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    }),
    db.campaign.findFirst({
      where: { groupId, status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalSold = orders.reduce((s, o) => s + o.items.reduce((si, i) => si + i.quantity, 0), 0);
  const totalEarnings = orders.reduce((s, o) => s + o.total, 0);
  const uniqueBuyers = new Set(orders.map((o) => o.userId)).size;

  return NextResponse.json({
    group,
    campaign,
    stats: {
      totalSold,
      totalEarnings,
      totalOrders: orders.length,
      uniqueBuyers,
    },
    orders: orders.slice(0, 20).map((o) => ({
      id: o.id,
      buyer: o.user.name ?? o.user.email,
      items: o.items.reduce((s, i) => s + i.quantity, 0),
      total: o.total,
      date: o.createdAt.toISOString().split("T")[0],
      status: o.status,
    })),
  });
}
