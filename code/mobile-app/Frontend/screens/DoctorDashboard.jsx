import React, { useState } from "react";
import { View, Text, Button, FlatList, TouchableOpacity } from "react-native";

const patientsData = [
  { id: "1", name: "John Doe", flapRecords: ["Flap A", "Flap B"] },
  { id: "2", name: "Jane Smith", flapRecords: ["Flap X", "Flap Y", "Flap Z"] },
];

export default function FlapSearchScreen() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatients, setShowPatients] = useState(false);

  const handleSearchFlapData = () => {
    setShowPatients(true);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      
      <Button title="Search Flap Data" onPress={handleSearchFlapData} style={{marginTop : 50,}}/>

      {showPatients && !selectedPatient && (
        <>
          <Text style={{ marginTop: 20, fontSize: 18 }}>Assigned Patients:</Text>
          <FlatList
            data={patientsData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedPatient(item)}
                style={{
                  padding: 15,
                  marginTop: 10,
                  backgroundColor: "#ddd",
                  borderRadius: 8,
                }}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}

      {selectedPatient && (
        <>
          <Text style={{ marginTop: 20, fontSize: 18 }}>
            {selectedPatient.name}'s Flap Records:
          </Text>
          <FlatList
            data={selectedPatient.flapRecords}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View
                style={{
                  padding: 10,
                  marginTop: 5,
                  backgroundColor: "#eee",
                  borderRadius: 5,
                }}
              >
                <Text>Falp details</Text>
              </View>
            )}
          />
          <Button title="Back to Patients" onPress={() => setSelectedPatient(null)} />
        </>
      )}
    </View>
  );
}
