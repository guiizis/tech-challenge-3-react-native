import CategorySelect from "@/components/home/CategorySelect";
import { uploadFile } from "@/services/storageApi";
import colors from "@/styles/colors";
import styles from "@/styles/homeStyles";
import { Category, TransactionType } from "@/types/finance";
import { FontAwesome5 } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type ReceiptUploadStatus = "idle" | "uploading" | "error";

type TransactionFormModalProps = {
  amount: string;
  category: string;
  categories: Category[];
  date: string;
  error: string;
  mode: "create" | "edit";
  receiptName: string;
  receiptUrl: string;
  title: string;
  type: TransactionType;
  visible: boolean;
  onAmountChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onClose: () => void;
  onDateChange: (value: string) => void;
  onReceiptUploaded: (url: string, name: string) => void;
  onSubmit: () => void;
  onTitleChange: (value: string) => void;
  onTypeChange: (type: TransactionType) => void;
};

export default function TransactionFormModal({
  amount,
  category,
  categories,
  date,
  error,
  mode,
  receiptName,
  receiptUrl,
  title,
  type,
  visible,
  onAmountChange,
  onCategoryChange,
  onClose,
  onDateChange,
  onReceiptUploaded,
  onSubmit,
  onTitleChange,
  onTypeChange,
}: TransactionFormModalProps) {
  const isIncome = type === "income";
  const inputStateStyle = isIncome ? styles.incomeInput : styles.expenseInput;
  const amountStateStyle = isIncome ? styles.incomeAmount : styles.expenseAmount;

  const [receiptStatus, setReceiptStatus] = useState<ReceiptUploadStatus>("idle");
  const [wasVisible, setWasVisible] = useState(visible);

  if (visible !== wasVisible) {
    setWasVisible(visible);

    if (visible) {
      setReceiptStatus("idle");
    }
  }

  async function handlePickReceipt() {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf"],
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    const file = result.assets[0];
    setReceiptStatus("uploading");

    try {
      const url = await uploadFile(`receipts/${Date.now()}-${file.name}`, file.uri);
      onReceiptUploaded(url, file.name);
      setReceiptStatus("idle");
    } catch {
      setReceiptStatus("error");
    }
  }

  function handleDownloadReceipt() {
    if (receiptUrl) {
      Linking.openURL(receiptUrl);
    }
  }

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

            <Text style={styles.modalLabel}>CATEGORIA:</Text>
            <CategorySelect
              categories={categories}
              value={category}
              visible={visible}
              onChange={onCategoryChange}
            />

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
            {receiptUrl && receiptStatus !== "uploading" ? (
              <View style={styles.receiptFileCard}>
                <FontAwesome5
                  name="file-alt"
                  size={18}
                  color={colors.income}
                />
                <Text
                  ellipsizeMode="middle"
                  numberOfLines={1}
                  style={styles.receiptFileName}
                >
                  {receiptName}
                </Text>
                <View style={styles.receiptFileActions}>
                  <TouchableOpacity
                    accessibilityLabel="Baixar comprovante"
                    accessibilityRole="button"
                    onPress={handleDownloadReceipt}
                    style={styles.receiptFileActionButton}
                  >
                    <FontAwesome5
                      name="download"
                      size={15}
                      color={colors.financePrimary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    accessibilityLabel="Trocar comprovante"
                    accessibilityRole="button"
                    onPress={handlePickReceipt}
                    style={styles.receiptFileActionButton}
                  >
                    <FontAwesome5
                      name="sync-alt"
                      size={15}
                      color={colors.financePrimary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                accessibilityLabel="Enviar comprovante"
                accessibilityRole="button"
                disabled={receiptStatus === "uploading"}
                onPress={handlePickReceipt}
                style={styles.receiptDropZone}
              >
                {receiptStatus === "uploading" ? (
                  <ActivityIndicator color={colors.financePrimary} size="small" />
                ) : (
                  <FontAwesome5
                    name={receiptStatus === "error" ? "exclamation-circle" : "folder"}
                    size={20}
                    color={receiptStatus === "error" ? colors.expense : colors.textSubtle}
                  />
                )}
                <Text style={styles.receiptDropText}>
                  {receiptStatus === "uploading"
                    ? "Enviando comprovante..."
                    : receiptStatus === "error"
                      ? "Falha no upload. Toque para tentar novamente"
                      : `Toque para selecionar o comprovante${"\n"}(imagem ou PDF)`}
                </Text>
              </TouchableOpacity>
            )}

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

