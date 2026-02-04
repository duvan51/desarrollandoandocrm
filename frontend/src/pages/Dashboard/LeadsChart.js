import React from "react";
import { useTheme } from "@material-ui/core/styles";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  Line,
  Tooltip
} from "recharts";

import Title from "./Title";

const LeadsChart = ({ data }) => {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>Nuevos Leads (Últimos 7 días)</Title>
      <ResponsiveContainer>
        <LineChart
          data={data}
          width={730}
          height={250}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke={theme.palette.text.secondary} />
          <YAxis
            type="number"
            allowDecimals={false}
            stroke={theme.palette.text.secondary}
          >
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: "middle", fill: theme.palette.text.primary }}
            >
              Leads
            </Label>
          </YAxis>
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke={theme.palette.primary.main} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
};

export default LeadsChart;
