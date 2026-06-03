import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

const products = [
  { name: "Hamburgerpress", description: "Forma perfekta hamburgare hemma. Gjord i rostfritt stål.", buyPrice: 35, sellPrice: 99, category: "Kök" },
  { name: "Bagagevåg", description: "Mät vikten på resväskan — undvik överviktsavgifter.", buyPrice: 40, sellPrice: 99, category: "Resor" },
  { name: "Gympåse", description: "Rymlig påse med separat skofack. Perfekt för träning.", buyPrice: 45, sellPrice: 129, category: "Sport" },
  { name: "Kryddkvarnar (set)", description: "Eleganta kvarnar för salt och peppar med justerbar grovlek.", buyPrice: 40, sellPrice: 99, category: "Kök" },
  { name: "Magnetlist för knivar", description: "Håll ordning på knivarna på ett snyggt och säkert sätt.", buyPrice: 35, sellPrice: 99, category: "Kök" },
  { name: "Silikonspatlar 3-pack", description: "Värmetåliga spatlar för all matlagning. Diskmaskinssäkra.", buyPrice: 30, sellPrice: 79, category: "Kök" },
  { name: "Powerbank", description: "10 000 mAh — laddar telefonen två gånger om. USB-C.", buyPrice: 45, sellPrice: 149, category: "Tech" },
  { name: "Bluetooth-högtalare", description: "Kompakt högtalare med 10h batteritid och vattentålig yta.", buyPrice: 45, sellPrice: 149, category: "Tech" },
  { name: "LED-pannlampa", description: "Händerna fria i mörkret. Upp till 100m lysskraft.", buyPrice: 25, sellPrice: 79, category: "Outdoor" },
  { name: "Digital köksvåg", description: "Precisionsvåg upp till 5 kg. Perfekt för bakning.", buyPrice: 35, sellPrice: 99, category: "Kök" },
  { name: "Termosmugg med lock", description: "Håller drycken varm i 6h. Passar de flesta kophållare.", buyPrice: 40, sellPrice: 119, category: "Resor" },
  { name: "Knivslip", description: "Få eggen vassegg igen på några sekunder.", buyPrice: 20, sellPrice: 69, category: "Kök" },
  { name: "Kabelorganiserare", description: "Håll ordning på alla kablar med dessa praktiska clips.", buyPrice: 20, sellPrice: 69, category: "Tech" },
  { name: "Hopfällbar mugg", description: "Platsspar i väskan — vikbar silikonmugg med lock.", buyPrice: 35, sellPrice: 99, category: "Resor" },
  { name: "Shoppingpåsar 3-pack", description: "Hållbara och vikbara. Tar aldrig plats i väskan.", buyPrice: 20, sellPrice: 79, category: "Hem" },
];

async function main() {
  console.log("Seeding products...");
  let count = 0;
  for (const p of products) {
    const existing = await db.product.findFirst({ where: { name: p.name } });
    if (!existing) {
      await db.product.create({ data: p });
      count++;
    }
  }
  console.log(`✓ ${count} nya produkter seedade`);
}

main().catch(console.error).finally(() => db.$disconnect());
