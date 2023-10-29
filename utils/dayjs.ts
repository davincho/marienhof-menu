import dayjs from "dayjs";
import "dayjs/locale/de";
import weekOfYear from "dayjs/plugin/weekOfYear";

export default function getInstance() {
  dayjs.locale("de");
  dayjs.extend(weekOfYear);

  return dayjs();
}
