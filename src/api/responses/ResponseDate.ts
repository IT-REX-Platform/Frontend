export class ResponseDate {
    public parseDate(date?: Date): Date | undefined {
        return date ? new Date(date) : undefined;
    }
}
