import colors from "@/styles/colors";
import styles from "@/styles/homeStyles";
import { TransactionFilter } from "@/types/finance";
import { FontAwesome5 } from "@expo/vector-icons";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";

type TransactionToolbarProps = {
  filter: TransactionFilter;
  isSearching: boolean;
  searchTerm: string;
  onAddPress: () => void;
  onFilterChange: (filter: TransactionFilter) => void;
  onSearchChange: (value: string) => void;
};

export default function TransactionToolbar({
  filter,
  isSearching,
  searchTerm,
  onAddPress,
  onFilterChange,
  onSearchChange,
}: TransactionToolbarProps) {
  return (
    <>
      <View style={styles.filters}>
        <Text
          onPress={() => onFilterChange("income")}
          style={[styles.filter, filter === "income" && styles.filterActive]}
        >
          Entradas
        </Text>
        <Text
          onPress={() => onFilterChange("expense")}
          style={[styles.filter, filter === "expense" && styles.filterActive]}
        >
          Saídas
        </Text>
        <Text
          onPress={() => onFilterChange("all")}
          style={[styles.filter, filter === "all" && styles.filterActive]}
        >
          Transações
        </Text>
      </View>

      {filter === "all" ? (
        <View style={styles.searchRow}>
          <TouchableOpacity
            accessibilityLabel="Adicionar transação"
            accessibilityRole="button"
            onPress={onAddPress}
            style={styles.addTransactionButton}
          >
            <FontAwesome5 name="plus" size={24} color={colors.financePrimary} />
          </TouchableOpacity>

          <View style={styles.searchBox}>
            <TextInput
              accessibilityLabel="Pesquisar transação"
              onChangeText={onSearchChange}
              placeholder="Pesquisar"
              placeholderTextColor={colors.financePrimary}
              style={styles.searchInput}
              value={searchTerm}
            />
            {isSearching ? (
              <ActivityIndicator color={colors.financePrimary} size="small" />
            ) : (
              <FontAwesome5
                name="search"
                size={24}
                color={colors.financePrimary}
              />
            )}
          </View>
        </View>
      ) : null}
    </>
  );
}
