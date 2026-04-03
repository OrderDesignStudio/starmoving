import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 管理者アカウント
  const admin = await prisma.user.upsert({
    where: { email: "admin@star-moving.co.jp" },
    update: {},
    create: {
      email: "admin@star-moving.co.jp",
      name: "管理者",
      password: hashSync("admin123", 10),
      role: "ADMIN",
    },
  });

  // サンプル営業担当者
  const rep1 = await prisma.user.upsert({
    where: { email: "tanaka@star-moving.co.jp" },
    update: {},
    create: {
      email: "tanaka@star-moving.co.jp",
      name: "田中太郎",
      password: hashSync("password123", 10),
      role: "SALES_REP",
    },
  });

  const rep2 = await prisma.user.upsert({
    where: { email: "suzuki@star-moving.co.jp" },
    update: {},
    create: {
      email: "suzuki@star-moving.co.jp",
      name: "鈴木花子",
      password: hashSync("password123", 10),
      role: "SALES_REP",
    },
  });

  // サンプル案件データ
  const cases = [
    {
      userId: rep1.id,
      caseDate: new Date("2026-03-01"),
      caseSource: "Web問い合わせ",
      caseType: "OFFICE",
      smoverId: "SM-2026-001",
      customerName: "株式会社サンプル",
      visitDate: new Date("2026-03-05"),
      estimateSubmitDate: new Date("2026-03-06"),
      status: "WON",
      movingDate: new Date("2026-04-15"),
      cargoVolume: 25.5,
      clientContact: "山田部長",
      letterEnclosed: "SENT",
      onSiteEstimate: "ON_SITE",
      moveCount: 2,
      budget: "300万円",
      companyDisclosure: "DONE",
      motivationDone: true,
      competingEstimates: 3,
      competingDetails: "A引越し、B運送",
      testClosingDone: true,
    },
    {
      userId: rep1.id,
      caseDate: new Date("2026-03-10"),
      caseSource: "紹介",
      caseType: "FAMILY",
      smoverId: "SM-2026-002",
      customerName: "佐藤様",
      visitDate: new Date("2026-03-15"),
      estimateSubmitDate: new Date("2026-03-16"),
      status: "ESTIMATE_SUBMITTED",
      movingDate: new Date("2026-05-01"),
      cargoVolume: 12.0,
      clientContact: "佐藤様",
      letterEnclosed: "SENT",
      onSiteEstimate: "LATER",
      moveCount: 1,
      budget: "不明",
      companyDisclosure: "NOT_DONE",
      motivationDone: false,
      competingEstimates: 2,
      testClosingDone: false,
    },
    {
      userId: rep2.id,
      caseDate: new Date("2026-03-12"),
      caseSource: "電話",
      caseType: "OFFICE",
      smoverId: "SM-2026-003",
      customerName: "テスト株式会社",
      visitDate: new Date("2026-03-18"),
      status: "APPOINTMENT",
      cargoVolume: 40.0,
      clientContact: "中村課長",
      letterEnclosed: "NOT_SENT",
      moveCount: 5,
      budget: "500万円上限",
      companyDisclosure: "DONE",
      motivationDone: true,
      competingEstimates: 1,
      testClosingDone: false,
      phoneClosingDate: new Date("2026-03-25"),
    },
    {
      userId: rep2.id,
      caseDate: new Date("2026-03-20"),
      caseSource: "Web問い合わせ",
      caseType: "DELIVERY",
      customerName: "高橋様",
      status: "PRE_ESTIMATE",
      clientContact: "高橋様",
      letterEnclosed: "NOT_SENT",
      companyDisclosure: "NOT_DONE",
      motivationDone: false,
      testClosingDone: false,
    },
    {
      userId: rep1.id,
      caseDate: new Date("2026-02-15"),
      caseSource: "紹介",
      caseType: "REMNANT",
      smoverId: "SM-2026-004",
      customerName: "伊藤様",
      visitDate: new Date("2026-02-20"),
      estimateSubmitDate: new Date("2026-02-21"),
      status: "LOST_TO_COMPETITOR",
      clientContact: "伊藤様",
      letterEnclosed: "SENT",
      onSiteEstimate: "ON_SITE",
      companyDisclosure: "DONE",
      motivationDone: true,
      competingEstimates: 4,
      competingDetails: "C引越し、D運送、E物流",
      testClosingDone: true,
    },
  ];

  for (const caseData of cases) {
    await prisma.case.create({ data: caseData });
  }

  // 成約案件に見積経費を追加
  const wonCase = await prisma.case.findFirst({ where: { status: "WON" } });
  if (wonCase) {
    await prisma.caseExpense.create({
      data: {
        caseId: wonCase.id,
        estimateAmount: 2800000,
        workingHours: 8,
        drivers: 2,
        assistants: 4,
        distance: 15,
        highwayToll: 3200,
        outsourcingCost: 50000,
        disposalCost: 30000,
        mediumBoxes: 30,
        largeBoxes: 15,
        otherExpenses: 10000,
      },
    });
  }

  console.log("Seed data created:", { admin: admin.email, rep1: rep1.email, rep2: rep2.email, cases: cases.length });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
