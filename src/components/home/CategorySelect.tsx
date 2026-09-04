import colors from "@/styles/colors";
import styles from "@/styles/homeStyles";
import { Category } from "@/types/finance";
import { FontAwesome5 } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type CategorySelectProps = {
  allOptionLabel?: string;
  categories: Category[];
  placeholder?: string;
  value: string;
  visible: boolean;
  onChange: (value: string) => void;
};

type CategoryOption = {
  label: string;
  value: string;
};

export default function CategorySelect({
  allOptionLabel,
  categories,
  placeholder = "Selecione uma categoria",
  value,
  visible,
  onChange,
}: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [wasVisible, setWasVisible] = useState(visible);

  if (visible !== wasVisible) {
    setWasVisible(visible);
    setIsOpen(false);
  }

  const selectedCategory = categories.find((item) => item.value === value);
  const selectedLabel =
    selectedCategory?.name ?? (value === "" ? allOptionLabel : value);

  function handleSelect(nextValue: string) {
    onChange(nextValue);
    setIsOpen(false);
  }

  const options: CategoryOption[] = [
    ...(allOptionLabel ? [{ label: allOptionLabel, value: "" }] : []),
    ...categories.map((item) => ({ label: item.name, value: item.value })),
  ];

  return (
    <View style={styles.categorySelectContainer}>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => setIsOpen(true)}
        style={styles.categorySelectField}
      >
        <Text
          style={[
            styles.categorySelectValue,
            !selectedLabel && styles.categorySelectPlaceholder,
          ]}
        >
          {selectedLabel || placeholder}
        </Text>
        <FontAwesome5
          name="chevron-down"
          size={12}
          color={colors.financePrimary}
        />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
        transparent
        visible={isOpen}
      >
        <Pressable
          onPress={() => setIsOpen(false)}
          style={styles.categorySelectModalBackdrop}
        >
          <Pressable style={styles.categorySelectModalSheet}>
            <Text style={styles.categorySelectModalTitle}>
              {placeholder}
            </Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item.value)}
                  style={styles.categorySelectOption}
                >
                  <Text
                    style={[
                      styles.categorySelectOptionText,
                      item.value === value &&
                        styles.categorySelectOptionTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
