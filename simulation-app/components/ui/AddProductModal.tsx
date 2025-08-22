import React from 'react';
import { Modal, StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';

import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { productService } from '@/services/api';

interface ProductForm {
  name: string;
  annualInterestRate: string;
  maxTermMonths: string;
}

interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  visible,
  onClose,
  onProductAdded,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [loading, setLoading] = React.useState(false);
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm<ProductForm>();

  const onSubmit = async (data: ProductForm) => {
    setLoading(true);
    try {
      const product = {
        name: data.name,
        annualInterestRate: parseFloat(data.annualInterestRate),
        maxTermMonths: parseInt(data.maxTermMonths),
      };
      
      const response = await productService.createProduct(product);
      
      if (response.success) {
        Alert.alert('Sucesso', 'Produto criado com sucesso!');
        reset();
        onClose();
        onProductAdded();
      } else {
        Alert.alert('Erro', response.message || 'Erro ao criar produto');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao criar produto');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <ThemedText type="title" style={[styles.title, { color: colors.primary }]}>
            Novo Produto
          </ThemedText>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <ThemedText style={[styles.closeText, { color: colors.text }]}>✕</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Card style={styles.formCard}>
            <ThemedText style={{ color: colors.text, marginBottom: 16 }}>
              Preencha as informações do novo produto de empréstimo
            </ThemedText>
            
            <Controller
              control={control}
              name="name"
              rules={{ required: 'Nome é obrigatório' }}
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Nome do Produto"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Ex: Empréstimo Pessoal"
                  error={errors.name?.message}
                />
              )}
            />
            
            <Controller
              control={control}
              name="annualInterestRate"
              rules={{ 
                required: 'Taxa de juros é obrigatória',
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: 'Digite uma taxa válida (ex: 18.5)'
                }
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Taxa de Juros Anual (%)"
                  value={value}
                  onChangeText={onChange}
                  placeholder="18.5"
                  keyboardType="decimal-pad"
                  error={errors.annualInterestRate?.message}
                />
              )}
            />
            
            <Controller
              control={control}
              name="maxTermMonths"
              rules={{ 
                required: 'Prazo máximo é obrigatório',
                pattern: {
                  value: /^\d+$/,
                  message: 'Digite um número válido'
                }
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Prazo Máximo (meses)"
                  value={value}
                  onChangeText={onChange}
                  placeholder="60"
                  keyboardType="numeric"
                  error={errors.maxTermMonths?.message}
                />
              )}
            />
          </Card>
        </View>

        <View style={styles.footer}>
          <View style={styles.buttonContainer}>
            <Button
              title="Cancelar"
              onPress={handleClose}
              variant="outline"
              style={styles.cancelButton}
            />
            <Button
              title="Criar Produto"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              style={styles.submitButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  closeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formCard: {
    padding: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
});