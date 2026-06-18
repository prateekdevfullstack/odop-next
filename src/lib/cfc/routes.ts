export function cfcLoginPath(): string {
  return "/cfc/login";
}

export function cfcPortalPath(): string {
  return "/cfc/portal";
}

export function cfcPortalEventsPath(): string {
  return "/cfc/portal/events";
}

export function cfcPortalEventNewPath(): string {
  return "/cfc/portal/events/new";
}

export function cfcPortalEventEditPath(id: number | string): string {
  return `/cfc/portal/events/${id}/edit`;
}

export function cfcPortalActivitiesPath(): string {
  return "/cfc/portal/activities";
}

export function cfcPortalActivityNewPath(): string {
  return "/cfc/portal/activities/new";
}

export function cfcPortalActivityDetailPath(id: number | string): string {
  return `/cfc/portal/activities/${id}`;
}

export function cfcPortalActivityEditPath(id: number | string): string {
  return `/cfc/portal/activities/${id}/edit`;
}

export function cfcPortalChartsPath(): string {
  return "/cfc/portal/charts";
}

export function cfcPortalChartNewPath(): string {
  return "/cfc/portal/charts/new";
}

export function cfcPortalChartEditPath(id: number | string): string {
  return `/cfc/portal/charts/${id}/edit`;
}

export function cfcPortalProfilePath(): string {
  return "/cfc/portal/profile";
}

export function cfcPublicListPath(): string {
  return "/resources/cfc-list";
}

export function cfcPublicDetailPath(id: number | string): string {
  return `/resources/cfc-list/${id}`;
}

export function cfcGalleryPath(cfcId?: number | string): string {
  if (cfcId == null || cfcId === "") return "/resources/cfc-list/gallery";
  return `/resources/cfc-list/gallery?cfc_id=${encodeURIComponent(String(cfcId))}`;
}

export function cfcPublicEventDetailPath(eventId: number | string): string {
  return `/resources/cfc-list/gallery/${eventId}`;
}
