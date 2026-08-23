import colors from "@/styles/colors";
import { Text, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

type OverviewDonutChartProps = {
  percentage: number;
  size?: number;
  strokeWidth?: number;
};

function normalizePercentage(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(Math.max(value, 0), 100);
}

export default function OverviewDonutChart({
  percentage,
  size = 216,
  strokeWidth = 28,
}: OverviewDonutChartProps) {
  const normalizedPercentage = normalizePercentage(percentage);
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const incomeLength = (circumference * normalizedPercentage) / 100;
  const expenseLength = circumference - incomeLength;
  const centerSize = size - strokeWidth * 3;

  return (
    <View
      style={{
        alignItems: "center",
        height: size,
        justifyContent: "center",
        width: size,
      }}
    >
      <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={center}
          cy={center}
          fill="none"
          r={radius}
          stroke={colors.chartTrack}
          strokeWidth={strokeWidth}
        />
        <G origin={`${center}, ${center}`} rotation="-90">
          <Circle
            cx={center}
            cy={center}
            fill="none"
            r={radius}
            stroke={colors.chartExpense}
            strokeDasharray={`${expenseLength} ${circumference}`}
            strokeLinecap="butt"
            strokeWidth={strokeWidth}
          />
          <Circle
            cx={center}
            cy={center}
            fill="none"
            r={radius}
            stroke={colors.chartIncome}
            strokeDasharray={`${incomeLength} ${circumference}`}
            strokeDashoffset={-expenseLength}
            strokeLinecap="butt"
            strokeWidth={strokeWidth}
          />
        </G>
      </Svg>

      <View
        style={{
          alignItems: "center",
          backgroundColor: colors.surface,
          borderRadius: centerSize / 2,
          height: centerSize,
          justifyContent: "center",
          position: "absolute",
          width: centerSize,
        }}
      >
        <Text
          style={{
            color: colors.textDark,
            fontSize: 24,
            fontWeight: "800",
          }}
        >
          {normalizedPercentage}%
        </Text>
      </View>
    </View>
  );
}

