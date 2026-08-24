import styles from "@/styles/homeStyles";
import { formatCurrency } from "@/utils/formatters";
import { Text, View } from "react-native";
import OverviewDonutChart from "./OverviewDonutChart";

type OverviewSectionProps = {
  expenseTotal: number;
  incomeTotal: number;
  percentage: number;
};

export default function OverviewSection({
  expenseTotal,
  incomeTotal,
  percentage,
}: OverviewSectionProps) {
  return (
    <View style={styles.overview}>
      <Text style={styles.overviewTitle}>Overview</Text>
      <OverviewDonutChart percentage={percentage} />
      <Text style={styles.overviewDescription}>
        Entradas {formatCurrency(incomeTotal)} / Saídas{" "}
        {formatCurrency(expenseTotal)}
      </Text>
    </View>
  );
}

