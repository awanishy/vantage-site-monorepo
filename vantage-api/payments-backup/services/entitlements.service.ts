export class EntitlementsService {
  static async grantCourseAccess(
    userId: string,
    programId: string
  ): Promise<void> {
    // Integrate with your course enrollment/access system here.
    // For now, this is a no-op placeholder to avoid blocking the webhook flow.
    return;
  }
}


