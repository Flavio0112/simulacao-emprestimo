import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Platform, ScrollView, Share, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { productService, simulationService } from '@/services/api';
import { LoanProduct, LoanSimulationResult } from '@/types/loan';
import { parseCurrency } from '@/utils/currency';

interface SimulationForm {
  productId: string;
  loanAmount: string;
  termMonths: string;
}

export default function SimulationScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { productId } = useLocalSearchParams();
  
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<LoanProduct | null>(null);
  const [simulationResult, setSimulationResult] = useState<LoanSimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFullTable, setShowFullTable] = useState(false);
  
  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<SimulationForm>({
    defaultValues: {
      productId: productId as string || '',
      loanAmount: '',
      termMonths: '',
    }
  });

  const watchedProductId = watch('productId');

  const loadProducts = async () => {
    try {
      const response = await productService.getProducts();
      if (response.success) {
        setProducts(response.data);
        
        // If productId is provided in URL, select it
        if (productId) {
          const product = response.data.find(p => p.id === productId);
          if (product) {
            setSelectedProduct(product);
            setValue('productId', product.id);
          }
        }
      } else {
        Alert.alert('Erro', response.message || 'Erro ao carregar produtos');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar produtos');
    }
  };

  const onSubmit = async (data: SimulationForm) => {
    setLoading(true);
    setSimulationResult(null);
    setShowFullTable(false); // Reset table view for new simulation
    
    try {
      const request = {
        productId: data.productId,
        loanAmount: parseCurrency(data.loanAmount),
        termMonths: parseInt(data.termMonths),
      };
      
      const response = await simulationService.simulateLoan(request);
      
      if (response.success) {
        setSimulationResult(response.data);
      } else {
        Alert.alert('Erro', response.message || 'Erro ao realizar simulação');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao realizar simulação');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  const generateSimulationSummary = (result: LoanSimulationResult): string => {
    return `📊 Simulação de Empréstimo\n\n` +
           `Produto: ${result.product.name}\n` +
           `Valor: ${formatCurrency(result.loanAmount)}\n` +
           `Prazo: ${result.termMonths} meses\n` +
           `Taxa mensal: ${formatPercentage(result.monthlyInterestRate)}\n` +
           `Parcela: ${formatCurrency(result.monthlyPayment)}\n` +
           `Total: ${formatCurrency(result.totalAmount)}`;
  };

  const generateWhatsAppMessage = (result: LoanSimulationResult): string => {
    return `🏦 *Simulação de Empréstimo*\n\n` +
           `💼 Produto: ${result.product.name}\n` +
           `💰 Valor: ${formatCurrency(result.loanAmount)}\n` +
           `📅 Prazo: ${result.termMonths} meses\n` +
           `📈 Taxa mensal: ${formatPercentage(result.monthlyInterestRate)}\n` +
           `💳 Parcela: ${formatCurrency(result.monthlyPayment)}\n` +
           `💵 Total: ${formatCurrency(result.totalAmount)}\n\n` +
           `Simulado pelo app de Empréstimos 📱`;
  };

  const exportSimulation = (result: LoanSimulationResult, format: string): string => {
    let content = generateSimulationSummary(result);
    content += `\n\n📋 Memória de Cálculo:\n`;
    result.monthlyBreakdown.forEach(payment => {
      content += `Mês ${payment.month}: Juros ${formatCurrency(payment.interest)} | ` +
                 `Amortização ${formatCurrency(payment.amortization)} | ` +
                 `Saldo ${formatCurrency(payment.balance)}\n`;
    });
    return content;
  };

  const handleShare = async (format: 'summary' | 'whatsapp' | 'detailed' = 'summary') => {
    if (!simulationResult) return;

    try {
      let content: string;
      let title: string;

      switch (format) {
        case 'whatsapp':
          content = generateWhatsAppMessage(simulationResult);
          title = 'Compartilhar via WhatsApp';
          break;
        case 'detailed':
          content = exportSimulation(simulationResult, 'text');
          title = 'Compartilhar simulação completa';
          break;
        case 'summary':
        default:
          content = generateSimulationSummary(simulationResult);
          title = 'Compartilhar resumo';
          break;
      }

      const shareOptions = {
        message: content,
        title,
      };

      if (Platform.OS === 'ios') {
        shareOptions.title = title;
      }

      await Share.share(shareOptions);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar a simulação');
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (watchedProductId) {
      const product = products.find(p => p.id === watchedProductId);
      setSelectedProduct(product || null);
    }
  }, [watchedProductId, products]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.titleContainer}>
          <ThemedText type="title" style={[styles.title, { color: colors.primary }]}>
            Simulação
          </ThemedText>
        </View>
        
        <View style={styles.description}>
          <ThemedText style={{ color: colors.text, marginTop: 8 }}>
            Simule seu empréstimo e veja os detalhes do pagamento
          </ThemedText>
        </View>

        <Card style={styles.formCard}>
          <ThemedText type="subtitle" style={{ color: colors.primary, marginBottom: 16 }}>
            Dados da Simulação
          </ThemedText>
          
          <Controller
            control={control}
            name="productId"
            rules={{ required: 'Selecione um produto' }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <ThemedText style={[styles.label, { color: colors.text }]}>
                  Produto de Empréstimo
                </ThemedText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsScroll}>
                  {products.map((product) => (
                    <Button
                      key={product.id}
                      title={product.name}
                      onPress={() => onChange(product.id)}
                      variant={value === product.id ? 'primary' : 'outline'}
                      size="small"
                      style={{ ...styles.productButton, marginRight: 8 }}
                    />
                  ))}
                </ScrollView>
                {errors.productId && (
                  <ThemedText style={[styles.error, { color: colors.error }]}>
                    {errors.productId.message}
                  </ThemedText>
                )}
              </View>
            )}
          />

          {selectedProduct && (
            <View style={[styles.productInfo, { backgroundColor: colors.surface }]}>
              <ThemedText style={{ color: colors.text, fontWeight: '600' }}>
                {selectedProduct.name}
              </ThemedText>
              <ThemedText style={{ color: colors.text, fontSize: 12, marginTop: 4 }}>
                Taxa: {selectedProduct.annualInterestRate}% a.a. • Prazo máximo: {selectedProduct.maxTermMonths} meses
              </ThemedText>
            </View>
          )}
          
          <Controller
            control={control}
            name="loanAmount"
            rules={{ 
              required: 'Valor do empréstimo é obrigatório',
              validate: (value) => {
                if (!value) return 'Valor do empréstimo é obrigatório';
                const numValue = parseCurrency(value);
                if (isNaN(numValue) || numValue <= 0) {
                  return 'Digite um valor válido';
                }
                if (numValue < 100) {
                  return 'Valor mínimo: R$ 100,00';
                }
                if (numValue > 1000000) {
                  return 'Valor máximo: R$ 1.000.000,00';
                }
                return true;
              }
            }}
            render={({ field: { onChange, value } }) => (
              <CurrencyInput
                label="Valor do Empréstimo"
                value={value}
                onChangeText={onChange}
                placeholder="10.000,00"
                error={errors.loanAmount?.message}
              />
            )}
          />
          
          <Controller
            control={control}
            name="termMonths"
            rules={{ 
              required: 'Prazo é obrigatório',
              pattern: {
                value: /^\d+$/,
                message: 'Digite um número válido'
              },
              validate: (value) => {
                if (!selectedProduct) return true;
                const months = parseInt(value);
                return months <= selectedProduct.maxTermMonths || 
                       `Prazo máximo para este produto: ${selectedProduct.maxTermMonths} meses`;
              }
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                label={`Prazo (meses)${selectedProduct ? ` - máx: ${selectedProduct.maxTermMonths}` : ''}`}
                value={value}
                onChangeText={onChange}
                placeholder="12"
                keyboardType="numeric"
                error={errors.termMonths?.message}
              />
            )}
          />
          
          <Button
            title="Simular Empréstimo"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            disabled={!selectedProduct}
            style={styles.simulateButton}
          />
        </Card>

        {simulationResult && (
          <Card style={styles.resultCard}>
            <ThemedText type="subtitle" style={{ color: colors.success, marginBottom: 16 }}>
              Resultado da Simulação
            </ThemedText>
            
            <View style={styles.resultHeader}>
              <ThemedText style={{ color: colors.text, fontSize: 18, fontWeight: '600' }}>
                {simulationResult.product.name}
              </ThemedText>
              <ThemedText style={{ color: colors.text, marginTop: 4 }}>
                Valor solicitado: {formatCurrency(simulationResult.loanAmount)}
              </ThemedText>
              <ThemedText style={{ color: colors.text }}>
                Prazo: {simulationResult.termMonths} meses
              </ThemedText>
            </View>

            <View style={[styles.summaryGrid, { borderTopColor: colors.border }]}>
              <View style={styles.summaryItem}>
                <ThemedText style={{ color: colors.placeholder, fontSize: 12 }}>
                  Taxa Efetiva Mensal
                </ThemedText>
                <ThemedText style={{ color: colors.primary, fontSize: 16, fontWeight: '600' }}>
                  {formatPercentage(simulationResult.monthlyInterestRate)}
                </ThemedText>
              </View>
              
              <View style={styles.summaryItem}>
                <ThemedText style={{ color: colors.placeholder, fontSize: 12 }}>
                  Parcela Mensal
                </ThemedText>
                <ThemedText style={{ color: colors.secondary, fontSize: 16, fontWeight: '600' }}>
                  {formatCurrency(simulationResult.monthlyPayment)}
                </ThemedText>
              </View>
              
              <View style={styles.summaryItem}>
                <ThemedText style={{ color: colors.placeholder, fontSize: 12 }}>
                  Valor Total
                </ThemedText>
                <ThemedText style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>
                  {formatCurrency(simulationResult.totalAmount)}
                </ThemedText>
              </View>
              
              <View style={styles.summaryItem}>
                <ThemedText style={{ color: colors.placeholder, fontSize: 12 }}>
                  Juros Totais
                </ThemedText>
                <ThemedText style={{ color: colors.warning, fontSize: 16, fontWeight: '600' }}>
                  {formatCurrency(simulationResult.totalInterest)}
                </ThemedText>
              </View>
            </View>

            <View style={styles.shareSection}>
              <View style={styles.shareHeader}>
                <ThemedText type="defaultSemiBold" style={{ color: colors.primary }}>
                  Compartilhar Simulação
                </ThemedText>
                <View style={styles.shareButtons}>
                  <Button
                    title="Resumo"
                    onPress={() => handleShare('summary')}
                    variant="outline"
                    size="small"
                    style={styles.shareButton}
                  />
                  <Button
                    title="WhatsApp"
                    onPress={() => handleShare('whatsapp')}
                    variant="primary"
                    size="small"
                    style={styles.shareButton}
                  />
                  <Button
                    title="Completo"
                    onPress={() => handleShare('detailed')}
                    variant="outline"
                    size="small"
                    style={styles.shareButton}
                  />
                </View>
              </View>
            </View>

            <View style={styles.amortizationHeader}>
              <ThemedText type="defaultSemiBold" style={{ color: colors.primary }}>
                Memória de Cálculo
              </ThemedText>
              <ThemedText style={{ color: colors.text, fontSize: 12, marginTop: 4 }}>
                Breakdown mensal dos pagamentos
              </ThemedText>
            </View>

            <View style={[styles.tableHeader, { backgroundColor: colors.surface }]}>
              <ThemedText style={[styles.tableHeaderText, { color: colors.text }]}>Mês</ThemedText>
              <ThemedText style={[styles.tableHeaderText, { color: colors.text }]}>Juros</ThemedText>
              <ThemedText style={[styles.tableHeaderText, { color: colors.text }]}>Amortização</ThemedText>
              <ThemedText style={[styles.tableHeaderText, { color: colors.text }]}>Saldo</ThemedText>
            </View>

            {(showFullTable ? simulationResult.monthlyBreakdown : simulationResult.monthlyBreakdown.slice(0, 6)).map((payment) => (
              <View key={payment.month} style={[styles.tableRow, { borderBottomColor: colors.border }]}>
                <ThemedText style={[styles.tableCell, { color: colors.text }]}>
                  {payment.month}
                </ThemedText>
                <ThemedText style={[styles.tableCell, { color: colors.warning }]}>
                  {formatCurrency(payment.interest)}
                </ThemedText>
                <ThemedText style={[styles.tableCell, { color: colors.success }]}>
                  {formatCurrency(payment.amortization)}
                </ThemedText>
                <ThemedText style={[styles.tableCell, { color: colors.text }]}>
                  {formatCurrency(payment.balance)}
                </ThemedText>
              </View>
            ))}

            {simulationResult.monthlyBreakdown.length > 6 && (
              <View style={styles.tableToggle}>
                <Button
                  title={showFullTable ? 
                    'Mostrar menos' : 
                    `Ver todos os ${simulationResult.monthlyBreakdown.length} meses`
                  }
                  onPress={() => setShowFullTable(!showFullTable)}
                  variant="outline"
                  size="small"
                  style={styles.toggleButton}
                />
              </View>
            )}
          </Card>
        )}

        {products.length === 0 && (
          <Card style={styles.emptyCard}>
            <ThemedText style={{ color: colors.text, textAlign: 'center' }}>
              Nenhum produto disponível para simulação.
            </ThemedText>
            <ThemedText style={{ color: colors.placeholder, textAlign: 'center', marginTop: 8 }}>
              Cadastre produtos na aba "Produtos" primeiro.
            </ThemedText>
          </Card>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  description: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 16,
  },
  formCard: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  productsScroll: {
    marginBottom: 8,
  },
  productButton: {
    minWidth: 120,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
  productInfo: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  simulateButton: {
    marginTop: 8,
  },
  resultCard: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  resultHeader: {
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    marginBottom: 16,
  },
  summaryItem: {
    width: '48%',
    marginBottom: 12,
  },
  shareSection: {
    marginBottom: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
  },
  shareHeader: {
    marginBottom: 12,
  },
  shareButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    gap: 8,
  },
  shareButton: {
    flex: 1,
  },
  amortizationHeader: {
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    textAlign: 'center',
  },
  tableToggle: {
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
    marginTop: 8,
  },
  toggleButton: {
    paddingHorizontal: 24,
  },
  emptyCard: {
    marginHorizontal: 20,
    paddingVertical: 32,
  },
});