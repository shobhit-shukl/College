import { redirect } from "next/navigation";

// The academic module lives at /academy; /Academic only holds sub-pages
// like /Academic/timetable, so send the bare path there instead of a 404.
export default function AcademicIndex() {
  redirect("/academy");
}
