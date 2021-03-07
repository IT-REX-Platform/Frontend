/**
 * Pauses code execution for provided timeout period.
 *
 * @param timeMs Time in milliseconds.
 */
export async function sleep(timeMs = 0): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, timeMs));
}
