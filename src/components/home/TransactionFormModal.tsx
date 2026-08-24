import colors from "@/styles/colors";
import styles from "@/styles/homeStyles";
import { TransactionType } from "@/types/finance";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type TransactionFormModalProps = {
  amount: string;
  date: string;
  error: string;
  mode: "create" | "edit";
  title: string;
  type: TransactionType;
  visible: boolean;
  onAmountChange: (value: string) => void;
  onClose: () => void;
  onDateChange: (value: string) => void;
  onSubmit: () => void;
  onTitleChange: (value: string) => void;
  onTypeChange: (type: TransactionType) => void;
};

export default function TransactionFormModal({
  amount,
  date,
  error,
  mode,
  title,
  type,
  visible,
  onAmountChange,
  onClose,
  onDateChange,
  onSubmit,
  onTitleChange,
  onTypeChange,
}: TransactionFormModalProps) {
  const isIncome = type === "income";
  const inputStateStyle = isIncome ? styles.incomeInput : styles.expenseInput;
  const amountStateStyle = isIncome ? styles.incomeAmount : styles.expenseAmount;

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 24 : 0}
        style={styles.modalBackdrop}
      >
        <View style={styles.transactionModalSheet}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {mode === "edit" ? "Editar Transação" : "Nova Transação"}
            </Text>
            <TouchableOpacity
              accessibilityLabel="Fechar transação"
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

          <ScrollView
            contentContainerStyle={styles.modalContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.transactionTypeControl}>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => onTypeChange("income")}
                style={[
                  styles.transactionTypeOption,
                  isIncome && styles.incomeTypeOptionActive,
                ]}
              >
                <FontAwesome5
                  name="plus-circle"
                  size={13}
                  color={isIncome ? colors.income : colors.textInactive}
                />
                <Text
                  style={[
                    styles.transactionTypeText,
                    isIncome && styles.incomeTypeOptionTextActive,
                  ]}
                >
                  Entrada
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => onTypeChange("expense")}
                style={[
                  styles.transactionTypeOption,
                  !isIncome && styles.expenseTypeOptionActive,
                ]}
              >
                <FontAwesome5
                  name="arrow-circle-down"
                  size={13}
                  color={!isIncome ? colors.expense : colors.textInactive}
                />
                <Text
                  style={[
                    styles.transactionTypeText,
                    !isIncome && styles.expenseTypeOptionTextActive,
                  ]}
                >
                  Saída
                </Text>
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.modalError}>{error}</Text> : null}

            <Text style={styles.modalLabel}>VALOR:</Text>
            <View style={[styles.amountInputContainer, inputStateStyle]}>
              <Text style={[styles.amountPrefix, amountStateStyle]}>R$</Text>
              <TextInput
                keyboardType="decimal-pad"
                onChangeText={onAmountChange}
                placeholder="0,00"
                style={styles.amountInput}
                value={amount}
              />
            </View>

            <Text style={styles.modalLabel}>DATA:</Text>
            <TextInput
              keyboardType="number-pad"
              maxLength={10}
              onChangeText={onDateChange}
              placeholder="DD/MM/AAAA"
              style={[styles.modalInput, inputStateStyle]}
              value={date}
            />

            <Text style={styles.modalLabel}>DESCRIÇÃO:</Text>
            <TextInput
              onChangeText={onTitleChange}
              placeholder="Nome da transação"
              style={[styles.modalInput, inputStateStyle]}
              value={title}
            />

            <Text style={styles.modalLabel}>COMPROVANTE:</Text>
            <View style={styles.receiptDropZone}>
              <FontAwesome5 name="folder" size={20} color={colors.textSubtle} />
              <Text style={styles.receiptDropText}>
                Click to browse or{"\n"}drag and drop your files
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={onSubmit} style={styles.modalConfirmButton}>
                <Text style={styles.modalButtonText}>CONFIRMAR</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.modalCancelButton}>
                <Text style={styles.modalButtonText}>CANCELAR</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

