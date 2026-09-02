import CategorySelect from "@/components/home/CategorySelect";
import colors from "@/styles/colors";
import styles from "@/styles/homeStyles";
import { Category, TransactionSort } from "@/types/finance";
import { FontAwesome5 } from "@expo/vector-icons";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

type TransactionFiltersModalProps = {
  categories: Category[];
  category: string;
  endDate: string;
  sort: TransactionSort;
  startDate: string;
  visible: boolean;
  onApply: () => void;
  onCategoryChange: (value: string) => void;
  onClose: () => void;
  onEndDateChange: (value: string) => void;
  onReset: () => void;
  onSortChange: (value: TransactionSort) => void;
  onStartDateChange: (value: string) => void;
};

export default function TransactionFiltersModal({
  categories,
  category,
  endDate,
  sort,
  startDate,
  visible,
  onApply,
  onCategoryChange,
  onClose,
  onEndDateChange,
  onReset,
  onSortChange,
  onStartDateChange,
}: TransactionFiltersModalProps) {
  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.filtersModalSheet}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtros</Text>
            <TouchableOpacity
              accessibilityLabel="Fechar filtros"
              accessibilityRole="button"
              onPress={onClose}
            >
              <FontAwesome5
                name="times"
                size={18}
                color={colors.financePrimary}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalLabel}>CATEGORIA:</Text>
          <CategorySelect
            allOptionLabel="Todas as categorias"
            categories={categories}
            value={category}
            visible={visible}
            onChange={onCategoryChange}
          />

          <View style={styles.filtersDateRow}>
            <View style={styles.filtersDateField}>
              <Text style={styles.modalLabel}>DATA INICIAL:</Text>
              <TextInput
                keyboardType="number-pad"
                maxLength={10}
                onChangeText={onStartDateChange}
                placeholder="DD/MM/AAAA"
                style={styles.modalInput}
                value={startDate}
              />
            </View>
            <View style={styles.filtersDateField}>
              <Text style={styles.modalLabel}>DATA FINAL:</Text>
              <TextInput
                keyboardType="number-pad"
                maxLength={10}
                onChangeText={onEndDateChange}
                placeholder="DD/MM/AAAA"
                style={styles.modalInput}
                value={endDate}
              />
            </View>
          </View>

          <Text style={styles.modalLabel}>ORDENAR POR:</Text>
          <View style={styles.sortControl}>
            <Text
              onPress={() => onSortChange("date_desc")}
              style={[
                styles.sortOption,
                sort === "date_desc" && styles.sortOptionActive,
              ]}
            >
              Mais recentes
            </Text>
            <Text
              onPress={() => onSortChange("date_asc")}
              style={[
                styles.sortOption,
                sort === "date_asc" && styles.sortOptionActive,
              ]}
            >
              Mais antigas
            </Text>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity onPress={onReset} style={styles.modalCancelButton}>
              <Text style={styles.modalButtonText}>LIMPAR</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onApply} style={styles.modalConfirmButton}>
              <Text style={styles.modalButtonText}>APLICAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

