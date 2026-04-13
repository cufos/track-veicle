import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
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

import { MaintenanceCategory } from '../../models/types';
import i18n from '../../i18n';

const CATEGORIES: MaintenanceCategory[] = [
  'maintenance',
  'service',
  'inspection',
  'tires',
  'tax',
  'insurance',
];

const CATEGORY_IMAGES: Record<MaintenanceCategory, any> = {
  maintenance: require('../../../assets/customer-support.png'),
  service: require('../../../assets/oil-gallon_17034637.png'),
  inspection: require('../../../assets/checklist.png'),
  tires: require('../../../assets/wheels_465128.png'),
  tax: require('../../../assets/car.png'),
  insurance: require('../../../assets/clipboard.png'),
  other: require('../../../assets/clipboard.png'),
};

const CATEGORY_COLORS: Record<MaintenanceCategory, string> = {
  maintenance: '#E8F4FD',
  service: '#FFF4E6',
  inspection: '#EAF7F0',
  tires: '#F3E8FF',
  tax: '#E6F7FF',
  insurance: '#FFF0F6',
  other: '#F1F3F5',
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

  const [selectedCategory, setSelectedCategory] =
    useState<MaintenanceCategory | null>(
      maintenance?.category ?? null,
    );

  const [title, setTitle] = useState(
    maintenance ? maintenance.title : '',
  );
  const [notes, setNotes] = useState(maintenance?.notes ?? '');
  const [dueDate, setDueDate] = useState(maintenance?.dueDate ?? '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    maintenance?.dueDate ? new Date(maintenance.dueDate) : new Date(),
  );
  const [reminderDaysBefore, setReminderDaysBefore] = useState(
    maintenance?.reminderDaysBefore
      ? String(maintenance.reminderDaysBefore)
      : '7',
  );
  const [cost, setCost] = useState(
    maintenance?.cost ? String(maintenance.cost) : '',
  );
  const [kilometers, setKilometers] = useState(
    maintenance?.kilometers ? String(maintenance.kilometers) : '',
  );
  const [type] = useState<'date' | 'interval'>('date');

  const handleSave = () => {
    if (!title || !dueDate || !selectedCategory) {
      Alert.alert(
        i18n.t("common.cancel"),
        i18n.t("maintenanceForm.requiredError"),
      );
      return;
    }

    addMaintenance({
      vehicleId,
      category: selectedCategory,
      title,
      dueDate,
      reminderDaysBefore: parseInt(reminderDaysBefore, 10),
      type,
      notes,
      cost: cost ? parseFloat(cost) : undefined,
      kilometers: kilometers ? parseInt(kilometers, 10) : undefined,
    });

    navigation.goBack();
  };

  const renderCategoryGrid = () => (
    <View style={styles.gridContainer}>
      <Text style={styles.title}>
        {i18n.t("maintenanceForm.selectCategory")}
      </Text>
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
            <Text style={styles.categoryText}>
              {i18n.t(`categories.${category}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderForm = () => (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => setSelectedCategory(null)}>
        <Text style={styles.changeCategory}>
          ← {i18n.t("maintenanceForm.changeCategory")}
        </Text>
      </TouchableOpacity>

      <Text style={styles.categorySelected}>
        {i18n.t('maintenance.due')}:{" "}
        {selectedCategory
          ? i18n.t(`categories.${selectedCategory}`)
          : ''}
      </Text>

      <Text style={styles.label}>
        {i18n.t("maintenanceForm.title")} *
      </Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder={i18n.t("maintenanceForm.titlePlaceholder")}
      />

      <Text style={styles.label}>
        {i18n.t("maintenanceForm.notes")}
      </Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={notes}
        onChangeText={setNotes}
        placeholder={i18n.t("maintenanceForm.notesPlaceholder")}
        multiline
      />

      <Text style={styles.label}>
        {i18n.t("maintenanceForm.dueDate")} *
      </Text>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>
          {(dueDate ? new Date(dueDate) : selectedDate).toLocaleDateString(
            i18n.locale,
            {
              day: "2-digit",
              month: "long",
              year: "numeric",
            },
          )}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) {
              setSelectedDate(date);
              const formatted = date.toISOString().split('T')[0];
              setDueDate(formatted);
            }
          }}
        />
      )}

      <Text style={styles.label}>
        {i18n.t("maintenanceForm.cost")}
      </Text>
      <TextInput
        style={styles.input}
        value={cost}
        onChangeText={setCost}
        keyboardType="numeric"
        placeholder={i18n.t("maintenanceForm.costPlaceholder")}
      />

      <Text style={styles.label}>
        {i18n.t("maintenanceForm.kilometers")}
      </Text>
      <TextInput
        style={styles.input}
        value={kilometers}
        onChangeText={setKilometers}
        keyboardType="numeric"
        placeholder={i18n.t("maintenanceForm.kilometersPlaceholder")}
      />

      <Text style={styles.label}>
        {i18n.t("maintenanceForm.remindBefore")}
      </Text>
      <TextInput
        style={styles.input}
        value={reminderDaysBefore}
        onChangeText={setReminderDaysBefore}
        keyboardType="numeric"
        placeholder={i18n.t("maintenanceForm.remindBeforePlaceholder")}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>
          {i18n.t("maintenanceForm.save")}
        </Text>
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
