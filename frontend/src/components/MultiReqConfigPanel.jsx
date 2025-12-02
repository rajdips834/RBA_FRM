import React from "react";
import Panel from "../components/core/Panel";
import Radio from "../components/core/Radio";

const MultiReqConfigPanel = ({
  setDispatchStrategy,
  setTotalRequests,
  setStartTime,
  setEndTime,
  setInterval,
  setNumUsers,
  setFraud,
  startTime,
  endTime,
  interval,
  dispatchStrategy,
  totalRequests,
  numUsers,
  fraud,
}) => {
  return (
    <Panel title="Multi-Request Configuration">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Total API Requests
          </label>
          <input
            type="number"
            value={totalRequests}
            onChange={(e) => setTotalRequests(parseInt(e.target.value, 10))}
            className="w-full bg-slate-700/50 border-slate-600 rounded-lg py-2 px-3 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Fraud API Requests
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={fraud}
            onChange={(e) => setFraud(parseInt(e.target.value, 10))}
            className="w-full bg-slate-700/50 border-slate-600 rounded-lg py-2 px-3 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Number of Users
          </label>
          <input
            type="number"
            min="1"
            value={numUsers}
            onChange={(e) => setNumUsers(parseInt(e.target.value, 10))}
            className="w-full bg-slate-700/50 border-slate-600 rounded-lg py-2 px-3 sm:text-sm"
          />
        </div>
        
        <div className="lg:col-span-2">
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Dispatch Strategy
          </label>
          <div className="flex gap-4 p-2 bg-slate-700/50 rounded-lg">
            <Radio
              label="Random"
              name="strategy"
              value="random"
              checked={dispatchStrategy === "random"}
              onChange={(e) => setDispatchStrategy(e.target.value)}
            />
            <Radio
              label="Interval"
              name="strategy"
              value="interval"
              checked={dispatchStrategy === "interval"}
              onChange={(e) => setDispatchStrategy(e.target.value)}
            />
            <Radio
              label="Immediate"
              name="strategy"
              value="immediate"
              checked={dispatchStrategy === "immediate"}
              onChange={(e) => setDispatchStrategy(e.target.value)}
            />
          </div>
        </div>

        {dispatchStrategy === "random" && (
          <>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Start Time
              </label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-700/50 border-slate-600 rounded-lg py-2 px-3 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                End Time
              </label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-slate-700/50 border-slate-600 rounded-lg py-2 px-3 sm:text-sm"
              />
            </div>
          </>
        )}
        {dispatchStrategy === "interval" && (
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Delay (ms)
            </label>
            <input
              type="number"
              value={interval}
              onChange={(e) => setInterval(parseInt(e.target.value, 10))}
              className="w-full bg-slate-700/50 border-slate-600 rounded-lg py-2 px-3 sm:text-sm"
            />
          </div>
        )}
      </div>
    </Panel>
  );
};

export default MultiReqConfigPanel;
