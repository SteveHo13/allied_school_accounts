import Dashboard from "views/Dashboard.js";
import Icons from "views/Icons.js";
import Tables from "views/Tables.js";
import Notifications from "views/Notifications.js";
import Rtl from "views/Rtl.js";
import TableList from "views/TableList.js";
import Typography from "views/Typography.js";
import UserProfile from "views/UserProfile.js";
import Start from "views/Start.js";
import Home from "views/Home.js";
import BalanceSheet from "views/BalanceSheet";
import ProfitAndLoss from "views/ProfitAndLoss";

var routes = [

  {
    path: "/start",
    name: "Start",
    // rtlName: "لوحة القيادة",
    icon: "tim-icons icon-chart-pie-36",
    component: Start,
    layout: "/public",
  },
  {
    path: "/home",
    name: "Add a Voucher ",
    // rtlName: "لوحة القيادة",
    icon: "tim-icons icon-bank",
    component: Home,
    layout: "/admin",
  },
  {
  path: "/std",
  name: "Add a Student",
  // rtlName: "طباعة",
  icon: "tim-icons icon-single-02",
  component: Typography,
  layout: "/admin",
}
,
  {
    path: "/tables",
    name: "View Entries",
    // rtlName: "خرائط",
    icon: "tim-icons icon-book-bookmark",
    component: Tables,
    layout: "/admin",
  },
  {
    path: "/balanceSheet",
    name: "Balance Sheet",
    // rtlName: "طباعة",
    icon: "tim-icons icon-notes",
    component: BalanceSheet,
    layout: "/admin",
  },
  {
    path: "/pnl",
    name: "Profit & Loss",
    // rtlName: "طباعة",
    icon: "tim-icons icon-coins",
    component: ProfitAndLoss,
    layout: "/admin",
  },
  // {
  //   path: "/dashboard",
  //   name: "Dashboard",
  //   rtlName: "لوحة القيادة",
  //   icon: "tim-icons icon-chart-pie-36",
  //   component: Dashboard,
  //   layout: "/admin",
  // },
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   rtlName: "الرموز",
  //   icon: "tim-icons icon-atom",
  //   component: Icons,
  //   layout: "/admin",
  // },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   rtlName: "إخطارات",
  //   icon: "tim-icons icon-bell-55",
  //   component: Notifications,
  //   layout: "/admin",
  // },
  // {
  //   path: "/user-profile",
  //   name: "User Profile",
  //   rtlName: "ملف تعريفي للمستخدم",
  //   icon: "tim-icons icon-single-02",
  //   component: UserProfile,
  //   layout: "/admin",
  // },
  // {
  //   path: "/tables",
  //   name: "Table List",
  //   rtlName: "قائمة الجدول",
  //   icon: "tim-icons icon-puzzle-10",
  //   component: TableList,
  //   layout: "/admin",
  // },

  // {
  //   path: "/rtl-support",
  //   name: "RTL Support",
  //   rtlName: "ار تي ال",
  //   icon: "tim-icons icon-world",
  //   component: Rtl,
  //   layout: "/rtl",
  // },
];
export default routes;
