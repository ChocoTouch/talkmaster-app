import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./views/private/pages/AuthPages/SignIn";
import SignUp from "./views/private/pages/AuthPages/SignUp";
import NotFound from "./views/private/pages/OtherPage/NotFound";
import UserProfiles from "./views/private/pages/UserProfiles";
import Videos from "./views/private/pages/UiElements/Videos";
import Images from "./views/private/pages/UiElements/Images";
import Alerts from "./views/private/pages/UiElements/Alerts";
import Badges from "./views/private/pages/UiElements/Badges";
import Avatars from "./views/private/pages/UiElements/Avatars";
import Buttons from "./views/private/pages/UiElements/Buttons";
import LineChart from "./views/private/pages/Charts/LineChart";
import BarChart from "./views/private/pages/Charts/BarChart";
import Calendar from "./views/private/pages/Calendar";
import BasicTables from "./views/private/pages/Tables/BasicTables";
import FormElements from "./views/private/pages/Forms/FormElements";
import Blank from "./views/private/pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./views/private/pages/Dashboard/Home";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
