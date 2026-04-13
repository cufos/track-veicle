import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { useMaintenances } from '../../context/MaintenancesContext';

type Props = any;

type CategoryType =
  | 'Mantenimiento'
  | 'Servicio'
  | 'Inspección'
  | 'Neumáticos'
  | 'Impuesto de circulación'
  | 'Aseguración';

const CATEGORIES: CategoryType[] = [
  'Mantenimiento',
  'Servicio',
  'Inspección',
  'Neumáticos',
  'Impuesto de circulación',
  'Aseguración',
];

const CATEGORY_IMAGES: Record<CategoryType, any> = {
  Mantenimiento: require('../../../assets/customer-support.png'),
  Servicio: require('../../../assets/oil-gallon_17034637.png'),
  Inspección: require('../../../assets/checklist.png'),
  Neumáticos: require('../../../assets/wheels_465128.png'),
  'Impuesto de circulación': require('../../../assets/car.png'),
  Aseguración: require('../../../assets/clipboard.png'),
};

const CATEGORY_COLORS: Record<CategoryType, string> = {
  Mantenimiento: '#E8F4FD', // azul claro suave
  Servicio: '#FFF4E6', // naranja claro suave
  Inspección: '#EAF7F0', // verde claro suave
  Neumáticos: '#F3E8FF', // violeta claro suave
  'Impuesto de circulación': '#E6F7FF', // celeste muy claro
  Aseguración: '#FFF0F6', // rosado muy claro
};

export default function AddMaintenanceScreen({ route, navigation }: Props) {
  const { vehicleId, maintenance } = route.params;
  const { addMaintenance } = useMaintenances();

  React.useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' },
    });

    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation]);

  const extractCategoryFromTitle = (fullTitle: string): CategoryType | null => {
    const found = CATEGORIES.find((cat) =>
      fullTitle.startsWith(`${cat} - `),
    );
    return found || null;
  };

  const extractCleanTitle = (fullTitle: string): string => {
    const category = extractCategoryFromTitle(fullTitle);
    if (!category) return fullTitle;
    return fullTitle.replace(`${category} - `, '');
  };

  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType | null>(
      maintenance ? extractCategoryFromTitle(maintenance.title) : null,
    );

  const [title, setTitle] = useState(
    maintenance ? extractCleanTitle(maintenance.title) : '',
  );
  const [notes, setNotes] = useState(maintenance?.notes ?? '');
  const [dueDate, setDueDate] = useState(maintenance?.dueDate ?? '');
  const [reminderDaysBefore, setReminderDaysBefore] = useState(
    maintenance?.reminderDaysBefore
      ? String(maintenance.reminderDaysBefore)
      : '7',
  );
  const [type] = useState<'date' | 'interval'>('date');

  const handleSave = () => {
    if (!title || !dueDate || !selectedCategory) {
      Alert.alert('Error', 'Completa los campos obligatorios');
      return;
    }

    addMaintenance({
      vehicleId,
      title: `${selectedCategory} - ${title}`,
      dueDate,
      reminderDaysBefore: parseInt(reminderDaysBefore, 10),
      type,
      notes,
    });

    navigation.goBack();
  };

  const renderCategoryGrid = () => (
    <View style={styles.gridContainer}>
      <Text style={styles.title}>Selecciona una categoría</Text>
      <View style={styles.grid}>
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryCard,
              { backgroundColor: CATEGORY_COLORS[category] },
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Image
              source={CATEGORY_IMAGES[category]}
              style={styles.categoryImage}
              resizeMode="contain"
            />
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderForm = () => (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => setSelectedCategory(null)}>
        <Text style={styles.changeCategory}>← Cambiar categoría</Text>
      </TouchableOpacity>

      <Text style={styles.categorySelected}>
        Categoría: {selectedCategory}
      </Text>

      <Text style={styles.label}>Título *</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Ej: Cambio de aceite"
      />

      <Text style={styles.label}>Notas</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={notes}
        onChangeText={setNotes}
        placeholder="Detalles adicionales"
        multiline
      />

      <Text style={styles.label}>Fecha de vencimiento *</Text>
      <TextInput
        style={styles.input}
        value={dueDate}
        onChangeText={setDueDate}
        placeholder="YYYY-MM-DD"
      />

      <Text style={styles.label}>Recordar días antes</Text>
      <TextInput
        style={styles.input}
        value={reminderDaysBefore}
        onChangeText={setReminderDaysBefore}
        keyboardType="numeric"
        placeholder="Ej: 7"
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return selectedCategory ? renderForm() : renderCategoryGrid();
}

const styles = StyleSheet.create({
  gridContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
  },
  categoryCard: {
    width: '90%',
    backgroundColor: '#f1f3f5',
    paddingVertical: 22,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryImage: {
    width: 36,
    height: 36,
    marginRight: 14,
  },
  categoryText: {
    fontWeight: '700',
    fontSize: 17,
    flexShrink: 1,
  },
  container: {
    padding: 16,
  },
  changeCategory: {
    color: '#007bff',
    marginBottom: 8,
    fontWeight: '500',
  },
  categorySelected: {
    fontWeight: '600',
    marginBottom: 12,
  },
  label: {
    fontWeight: '600',
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 24,
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
