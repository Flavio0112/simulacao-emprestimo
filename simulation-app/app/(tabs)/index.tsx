import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FAB } from '@/components/ui/FAB';
import { AddProductModal } from '@/components/ui/AddProductModal';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { productService } from '@/services/api';
import { LoanProduct } from '@/types/loan';


export default function ProductsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const loadProducts = async () => {
    try {
      const response = await productService.getProducts();
      if (response.success) {
        setProducts(response.data);
      } else {
        Alert.alert('Erro', response.message || 'Erro ao carregar produtos');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar produtos');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const handleProductAdded = async () => {
    await loadProducts();
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.titleContainer}>
          <ThemedText type="title" style={[styles.title, { color: colors.primary }]}>
            Empréstimos
          </ThemedText>
        </View>
        
        <View style={styles.description}>
          <ThemedText style={{ color: colors.text, marginTop: 8 }}>
            Gerencie os produtos disponíveis para simulação
          </ThemedText>
        </View>


        <View style={styles.productsContainer}>
          <ThemedText type="subtitle" style={{ color: colors.primary, marginBottom: 16 }}>
            Produtos Disponíveis ({products.length})
          </ThemedText>
          
          {products.map((product) => (
            <Card key={product.id} style={styles.productCard}>
              <ThemedText type="defaultSemiBold" style={{ color: colors.text, fontSize: 18 }}>
                {product.name}
              </ThemedText>
              <View style={styles.productDetails}>
                <ThemedText style={{ color: colors.text }}>
                  Taxa: {product.annualInterestRate}% a.a.
                </ThemedText>
                <ThemedText style={{ color: colors.text }}>
                  Prazo máximo: {product.maxTermMonths} meses
                </ThemedText>
              </View>
              <Button
                title="Simular Empréstimo"
                onPress={() => router.push({
                  pathname: '/product-simulation',
                  params: { 
                    productId: product.id,
                    productName: product.name
                  }
                })}
                variant="outline"
                size="small"
                style={styles.simulateButton}
              />
            </Card>
          ))}
          
          {products.length === 0 && (
            <Card style={styles.emptyCard}>
              <ThemedText style={{ color: colors.text, textAlign: 'center' }}>
                Nenhum produto cadastrado ainda.
              </ThemedText>
              <ThemedText style={{ color: colors.placeholder, textAlign: 'center', marginTop: 8 }}>
                Crie seu primeiro produto de empréstimo acima.
              </ThemedText>
            </Card>
          )}
        </View>
      </ScrollView>
      
      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        <FAB
          icon="plus"
          label="Novo Produto"
          onPress={() => setShowModal(true)}
          variant="primary"
        />
      </View>
      
      {/* Add Product Modal */}
      <AddProductModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onProductAdded={handleProductAdded}
      />
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
  scrollContent: {
    paddingBottom: 100, // Add space for FAB
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
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  productsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  productCard: {
    marginBottom: 12,
  },
  productDetails: {
    marginTop: 8,
    marginBottom: 12,
    gap: 4,
  },
  simulateButton: {
    alignSelf: 'flex-start',
  },
  emptyCard: {
    paddingVertical: 32,
  },
});
