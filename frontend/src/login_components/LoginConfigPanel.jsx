import React, { useState } from "react";
import Panel from "../components/core/Panel";
import Select from "../components/core/Select";
import Input from "../components/core/Input";
import { countryCityOptions, timezoneOptions } from "../data/locationOptions";

const countryOptions = Object.keys(countryCityOptions).map((country) => ({
  value: country,
  label: country,
}));

const LoginConfigPanel = ({ loginData, setLoginData, isMultiRequest }) => {
  const [selectedCountry, setSelectedCountry] = useState(
    loginData.country || "India"
  );
  const onLoginDataChange = (e) =>
    setLoginData((p) => ({ ...p, [e.target.name]: e.target.value }));
  return (
    <Panel title="Other Login Details">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Conditionally render time taken to login range */}
        {isMultiRequest ? (
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-sm text-slate-300 font-medium">
              Time Taken to Login Range
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input
                name="time_taken_to_complete_login_min"
                value={loginData.time_taken_to_complete_login_min}
                onChange={onLoginDataChange}
                placeholder="Min"
                type="number"
                label="Min Time To Login"
              />
              <Input
                name="time_taken_to_complete_login_max"
                value={loginData.time_taken_to_complete_login_max}
                onChange={onLoginDataChange}
                placeholder="Max"
                type="number"
                label="Max Time to Login"
              />
            </div>
          </div>
        ) : (
          <Input
            label="Time Taken to Login"
            name="time_taken_to_complete_login"
            value={loginData.time_taken_to_complete_login}
            onChange={onLoginDataChange}
            type="number"
            placeholder="e.g., 5"
          />
        )}

        {/* Conditionally render timestamp range */}
        {isMultiRequest ? (
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-sm text-slate-300 font-medium">
              Login Timestamp Range
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input
                name="timestamp_start"
                value={loginData.timestamp_start}
                onChange={onLoginDataChange}
                type="datetime-local"
                label="Start Time"
              />
              <Input
                name="timestamp_end"
                value={loginData.timestamp_end}
                onChange={onLoginDataChange}
                type="datetime-local"
                label="End Time"
              />
            </div>
          </div>
        ) : (
          <Input
            label="Timestamp"
            name="timestamp"
            value={loginData.timestamp}
            onChange={onLoginDataChange}
            type="datetime-local"
          />
        )}

        {/* Country dropdown*/}
        <Select
          label="Country"
          name="country"
          value={selectedCountry}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            const firstCity =
              countryCityOptions[e.target.value][0]?.value || "";
            // Update both country and city in loginData
            onLoginDataChange({
              target: { name: "country", value: e.target.value },
            });
            onLoginDataChange({ target: { name: "city", value: firstCity } });
          }}
          options={countryOptions}
        />

        {/* City dropdown (filtered by country) */}
        <Select
          label="City"
          name="city"
          value={loginData.city}
          onChange={onLoginDataChange}
          options={countryCityOptions[selectedCountry]}
        />

        <Select
          label="Time Zone"
          name="time_zone"
          value={loginData.time_zone}
          onChange={onLoginDataChange}
          options={timezoneOptions}
        />
      </div>
    </Panel>
  );
};

export default LoginConfigPanel;
