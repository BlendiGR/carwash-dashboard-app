import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const fakeCustomers = [
  {
    name: "Matti Virtanen",
    email: "matti.virtanen@email.fi",
    phone: "+358 40 123 4567",
    plate: "ABC-123",
    company: "Virtanen Oy",
  },
  {
    name: "Anna Korhonen",
    email: "anna.korhonen@email.fi",
    phone: "+358 50 234 5678",
    plate: "XYZ-789",
    company: null,
  },
  {
    name: "Juha Nieminen",
    email: "juha.nieminen@email.fi",
    phone: "+358 44 345 6789",
    plate: "DEF-456",
    company: "Nieminen & Co",
  },
  {
    name: "Liisa Mäkelä",
    email: "liisa.makela@email.fi",
    phone: "+358 40 456 7890",
    plate: "GHI-321",
    company: null,
  },
  {
    name: "Pekka Heikkinen",
    email: "pekka.heikkinen@email.fi",
    phone: "+358 50 567 8901",
    plate: "JKL-654",
    company: "Heikkinen Autohuolto",
  },
  {
    name: "Sari Laine",
    email: "sari.laine@email.fi",
    phone: "+358 44 678 9012",
    plate: "MNO-987",
    company: null,
  },
  {
    name: "Timo Koskinen",
    email: "timo.koskinen@email.fi",
    phone: "+358 40 789 0123",
    plate: "PQR-111",
    company: "Koskinen Logistics",
  },
  {
    name: "Hanna Järvinen",
    email: "hanna.jarvinen@email.fi",
    phone: "+358 50 890 1234",
    plate: "STU-222",
    company: null,
  },
  {
    name: "Mikko Lehtonen",
    email: "mikko.lehtonen@email.fi",
    phone: "+358 44 901 2345",
    plate: "VWX-333",
    company: "Lehtonen Kuljetus",
  },
  {
    name: "Laura Salonen",
    email: "laura.salonen@email.fi",
    phone: "+358 40 012 3456",
    plate: "YZA-444",
    company: null,
  },
  // More customers for pagination testing
  {
    name: "Ville Hämäläinen",
    email: "ville.hamalainen@email.fi",
    phone: "+358 40 111 2222",
    plate: "BCD-555",
    company: "Hämäläinen Motors",
  },
  {
    name: "Eeva Laakso",
    email: "eeva.laakso@email.fi",
    phone: "+358 50 222 3333",
    plate: "EFG-666",
    company: null,
  },
  {
    name: "Antti Rantanen",
    email: "antti.rantanen@email.fi",
    phone: "+358 44 333 4444",
    plate: "HIJ-777",
    company: "Rantanen Racing",
  },
  {
    name: "Kaisa Tuominen",
    email: "kaisa.tuominen@email.fi",
    phone: "+358 40 444 5555",
    plate: "KLM-888",
    company: null,
  },
  {
    name: "Jari Salminen",
    email: "jari.salminen@email.fi",
    phone: "+358 50 555 6666",
    plate: "NOP-999",
    company: "Salminen Service",
  },
  {
    name: "Riikka Ahonen",
    email: "riikka.ahonen@email.fi",
    phone: "+358 44 666 7777",
    plate: "QRS-101",
    company: null,
  },
  {
    name: "Teemu Laitinen",
    email: "teemu.laitinen@email.fi",
    phone: "+358 40 777 8888",
    plate: "TUV-202",
    company: "Laitinen Auto",
  },
  {
    name: "Mari Kinnunen",
    email: "mari.kinnunen@email.fi",
    phone: "+358 50 888 9999",
    plate: "WXY-303",
    company: null,
  },
  {
    name: "Petri Karjalainen",
    email: "petri.karjalainen@email.fi",
    phone: "+358 44 999 0000",
    plate: "ZAB-404",
    company: "Karjalainen Cars",
  },
  {
    name: "Tiina Lindgren",
    email: "tiina.lindgren@email.fi",
    phone: "+358 40 100 2001",
    plate: "CDE-505",
    company: null,
  },
  {
    name: "Olli Väisänen",
    email: "olli.vaisanen@email.fi",
    phone: "+358 50 200 3002",
    plate: "FGH-606",
    company: "Väisänen Wheels",
  },
  {
    name: "Helena Mäkinen",
    email: "helena.makinen@email.fi",
    phone: "+358 44 300 4003",
    plate: "IJK-707",
    company: null,
  },
  {
    name: "Markus Hiltunen",
    email: "markus.hiltunen@email.fi",
    phone: "+358 40 400 5004",
    plate: "LMN-808",
    company: "Hiltunen Transport",
  },
  {
    name: "Johanna Koivisto",
    email: "johanna.koivisto@email.fi",
    phone: "+358 50 500 6005",
    plate: "OPQ-909",
    company: null,
  },
  {
    name: "Kalle Hakala",
    email: "kalle.hakala@email.fi",
    phone: "+358 44 600 7006",
    plate: "RST-010",
    company: "Hakala Garage",
  },
  {
    name: "Elina Nurmi",
    email: "elina.nurmi@email.fi",
    phone: "+358 40 700 8007",
    plate: "UVW-121",
    company: null,
  },
  {
    name: "Harri Pitkänen",
    email: "harri.pitkanen@email.fi",
    phone: "+358 50 800 9008",
    plate: "XYZ-232",
    company: "Pitkänen Parts",
  },
  {
    name: "Sanna Mikkola",
    email: "sanna.mikkola@email.fi",
    phone: "+358 44 900 0009",
    plate: "ABC-343",
    company: null,
  },
  {
    name: "Jussi Aaltonen",
    email: "jussi.aaltonen@email.fi",
    phone: "+358 40 010 1010",
    plate: "DEF-454",
    company: "Aaltonen Auto",
  },
  {
    name: "Kirsi Ojala",
    email: "kirsi.ojala@email.fi",
    phone: "+358 50 020 2020",
    plate: "GHI-565",
    company: null,
  },
];

async function main() {
  console.log("🌱 Seeding customers...");

  for (const customer of fakeCustomers) {
    await prisma.customer.upsert({
      where: { email: customer.email! },
      update: {},
      create: customer,
    });
  }

  console.log(`✅ Seeded ${fakeCustomers.length} customers`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
