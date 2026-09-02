import colors from "@/styles/colors";
import styles from "@/styles/homeStyles";
import { Category } from "@/types/finance";
import { FontAwesome5 } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

type CategorySelectProps = {
  allOptionLabel?: string;
  categories: Category[];
  placeholder?: string;
  value: string;
  visible: boolean;
  onChange: (value: string) => void;
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

  return (
    <View style={styles.categorySelectContainer}>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => setIsOpen((current) => !current)}
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
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={12}
          color={colors.financePrimary}
        />
      </TouchableOpacity>

      {isOpen ? (
        <View style={styles.categorySelectOptions}>
          <ScrollView nestedScrollEnabled>
            {allOptionLabel ? (
              <TouchableOpacity
                onPress={() => handleSelect("")}
                style={styles.categorySelectOption}
              >
                <Text style={styles.categorySelectOptionText}>
                  {allOptionLabel}
                </Text>
              </TouchableOpacity>
            ) : null}
            {categories.map((item) => (
              <TouchableOpacity
                key={item.value}
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
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}
