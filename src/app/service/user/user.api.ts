export async function insertReport(report: ReportModel): Promise<any | {status: number}> {
    try {
        const body = {
            id: report.id,
            userId: report.userId,
            content: report.content,
            entryDate: report.entryDate
        }

        const resp = await fetch('http://localhost:8080/api/report/save',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
            body: JSON.stringify(body)

    })
        const contentType =
            resp.headers.get('content-type');

        if (resp.ok && contentType?.includes('application.json')) {
            const data: any = await resp.json();
            return data;
        } else {
            const errorMessage = await resp.text();
            throw new Error(`Server returned non-JSON response: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Error occurred while inserting tag:', error);
        return {status: 500};
    }
}