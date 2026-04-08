export const CASE_STATUS = {
  WON: "WON",
  WON_CANCELLED: "WON_CANCELLED",
  APPOINTMENT: "APPOINTMENT",
  CONSIDERING: "CONSIDERING",
  ESTIMATE_SUBMITTED: "ESTIMATE_SUBMITTED",
  PRE_ESTIMATE: "PRE_ESTIMATE",
  LOST_TO_COMPETITOR: "LOST_TO_COMPETITOR",
} as const;

export const CASE_STATUS_LABELS: Record<string, string> = {
  WON: "成約",
  WON_CANCELLED: "成約キャンセル",
  APPOINTMENT: "アポ予約済",
  CONSIDERING: "検討中",
  ESTIMATE_SUBMITTED: "見積提出済み",
  PRE_ESTIMATE: "見積提出前",
  LOST_TO_COMPETITOR: "他社決め",
};

export const CASE_STATUS_COLORS: Record<string, string> = {
  WON: "bg-[#f0fdf4] text-[#166534]",
  WON_CANCELLED: "bg-[#fff5f5] text-[#ff5b4f]",
  APPOINTMENT: "bg-[#ebf5ff] text-[#0068d6]",
  CONSIDERING: "bg-[#fafafa] text-[#666666]",
  ESTIMATE_SUBMITTED: "bg-[#f5f3ff] text-[#6d28d9]",
  PRE_ESTIMATE: "bg-[#fafafa] text-[#808080]",
  LOST_TO_COMPETITOR: "bg-[#fdf2f8] text-[#de1d8d]",
};

export const CASE_TYPE = {
  OFFICE: "OFFICE",
  FAMILY: "FAMILY",
  REMNANT: "REMNANT",
  DELIVERY: "DELIVERY",
} as const;

export const CASE_TYPE_LABELS: Record<string, string> = {
  OFFICE: "オフィス引越し",
  FAMILY: "家族引越し",
  REMNANT: "残置",
  DELIVERY: "配送",
};

export const LETTER_STATUS_LABELS: Record<string, string> = {
  SENT: "済",
  NOT_SENT: "未送付",
};

export const ON_SITE_ESTIMATE_LABELS: Record<string, string> = {
  ON_SITE: "その場提出",
  LATER: "後日提出",
};

export const DISCLOSURE_LABELS: Record<string, string> = {
  NOT_DONE: "未実施",
  DONE: "実施",
};

export const ROLE = {
  ADMIN: "ADMIN",
  SALES_REP: "SALES_REP",
} as const;
