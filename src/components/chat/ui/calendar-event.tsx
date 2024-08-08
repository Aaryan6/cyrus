export type EventsListProps = {
  data: {
    summary?: string | null;
    description?: string | null;
    updated?: string | null;
    timeZone?: string | null;
    defaultReminders?:
      | [
          {
            method: string;
            minutes: number;
          }
        ]
      | any;
    items?:
      | [
          {
            id: string;
            status?: string | null;
            htmlLink?: string | null;
            created?: string | null;
            updated?: string | null;
            summary?: string | null;
            creator: {
              email?: string | null;
              self: boolean;
            };
            organizer: {
              email?: string | null;
              self: boolean;
            };
            start: {
              dateTime?: string | null;
              timeZone?: string | null;
            };
            end: {
              dateTime?: string | null;
              timeZone?: string | null;
            };
            reminders: {
              useDefault: boolean;
            };
            eventType: boolean;
          }
        ]
      | any;
  };
};

export function ShowEvent({ data }: EventsListProps) {
  return (
    <div className="whitespace-pre-wrap bg-foreground text-background p-4">
      {data.items?.map((item: any) => (
        <div key={item.id} className="mb-4">
          <h2 className="text-xl font-bold">{item.summary}</h2>
          <p>{item.description}</p>
          <p>
            <strong>Start Time:</strong> {item.start?.dateTime}
          </p>
          <p>
            <strong>End Time:</strong> {item.end?.dateTime}
          </p>
          <p>
            <strong>Created:</strong> {item.created}
          </p>
          <p>
            <strong>Updated:</strong> {item.updated}
          </p>
          <p>
            <strong>Time Zone:</strong> {item.timeZone}
          </p>
          <p>
            <strong>Creator:</strong> {item.creator.email}
          </p>
          <p>
            <strong>Organizer:</strong> {item.organizer.email}
          </p>
          <p>
            <strong>Link:</strong> <a href={item.htmlLink}>Link</a>
          </p>
        </div>
      ))}
    </div>
  );
}
