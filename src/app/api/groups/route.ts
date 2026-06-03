import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/å/g, "a").replace(/ä/g, "a").replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { groupName, groupType, contactName, contactEmail, contactPhone, memberCount, message, password } = body;

  if (!groupName || !contactName || !contactEmail || !password) {
    return NextResponse.json({ error: "Saknade fält" }, { status: 400 });
  }

  const existing = await db.user.findUnique({ where: { email: contactEmail } });
  if (existing) {
    return NextResponse.json({ error: "E-postadressen används redan" }, { status: 409 });
  }

  const base = slugify(groupName);
  let slug = base;
  let suffix = 1;
  while (await db.group.findUnique({ where: { slug } })) {
    slug = `${base}-${suffix++}`;
  }

  const group = await db.group.create({
    data: {
      name: groupName,
      slug,
      description: [groupType, contactPhone, memberCount ? `${memberCount} säljare` : null, message]
        .filter(Boolean).join(" | ") || null,
    },
  });

  const hashedPassword = await hash(password, 12);

  await db.user.create({
    data: {
      email: contactEmail,
      name: contactName,
      password: hashedPassword,
      role: "SELLER",
      groupId: group.id,
    },
  });

  const endsAt = new Date();
  endsAt.setDate(endsAt.getDate() + 30);

  await db.campaign.create({
    data: {
      groupId: group.id,
      name: `${groupName} — sommarkampanjen`,
      startsAt: new Date(),
      endsAt,
      status: "ACTIVE",
    },
  });

  return NextResponse.json({ slug, groupId: group.id }, { status: 201 });
}
