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
  WON: "bg-green-100 text-green-800",
  WON_CANCELLED: "bg-red-100 text-red-800",
  APPOINTMENT: "bg-blue-100 text-blue-800",
  CONSIDERING: "bg-yellow-100 text-yellow-800",
  ESTIMATE_SUBMITTED: "bg-purple-100 text-purple-800",
  PRE_ESTIMATE: "bg-gray-100 text-gray-800",
  LOST_TO_COMPETITOR: "bg-orange-100 text-orange-800",
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
