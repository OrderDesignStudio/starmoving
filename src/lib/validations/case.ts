import { z } from "zod";

export const caseFormSchema = z.object({
  // 案件概要
  userId: z.string().optional(),
  caseDate: z.string().min(1, "案件発生日は必須です"),
  caseSource: z.string().min(1, "案件発生経路は必須です"),
  caseType: z.string().min(1, "案件種別は必須です"),
  smoverId: z.string().optional(),
  customerName: z.string().min(1, "顧客名は必須です"),
  visitDate: z.string().optional(),
  estimateSubmitDate: z.string().optional(),
  status: z.string().min(1, "状況は必須です"),
  movingDate: z.string().optional(),
  cargoVolume: z.coerce.number().optional().nullable(),
  clientContact: z.string().optional(),
  letterEnclosed: z.string().default("NOT_SENT"),
  onSiteEstimate: z.string().optional(),
  notes: z.string().optional(),
  // ヒアリング
  moveCount: z.coerce.number().int().optional().nullable(),
  budget: z.string().optional(),
  companyDisclosure: z.string().default("NOT_DONE"),
  motivationDone: z.boolean().default(false),
  competingEstimates: z.coerce.number().int().optional().nullable(),
  competingDetails: z.string().optional(),
  // クロージング
  testClosingDone: z.boolean().default(false),
  phoneClosingDate: z.string().optional(),
  // 見積時経費
  estimateAmount: z.coerce.number().int().optional().nullable(),
  workingHours: z.coerce.number().optional().nullable(),
  drivers: z.coerce.number().int().optional().nullable(),
  assistants: z.coerce.number().int().optional().nullable(),
  distance: z.coerce.number().optional().nullable(),
  highwayToll: z.coerce.number().int().optional().nullable(),
  outsourcingCost: z.coerce.number().int().optional().nullable(),
  disposalCost: z.coerce.number().int().optional().nullable(),
  mediumBoxes: z.coerce.number().int().optional().nullable(),
  largeBoxes: z.coerce.number().int().optional().nullable(),
  otherExpenses: z.coerce.number().int().optional().nullable(),
  outsourcingDetails: z.string().optional(),
});

export type CaseFormData = z.infer<typeof caseFormSchema>;
