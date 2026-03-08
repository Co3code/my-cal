import { evaluate } from "mathjs";
import React, { useState } from "react";
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";


const { width } = Dimensions.get("window");
const buttonSize = width * 0.21;

export default function App() {
  const [display, setDisplay] = useState("0");
  const [history, setHistory] = useState<string[]>([]);

  const handlePress = (value: string) => {
    if (value === "=") {
      try {
        const result = evaluate(display);

        // convert result safely to number
        const numResult = Number(result);

        const formattedResult = Number.isInteger(numResult) ? numResult.toString() : numResult.toFixed(4);

        // save history
        setHistory((prev) => [`${display} = ${formattedResult}`, ...prev]);

        setDisplay(formattedResult);
      } catch {
        setDisplay("Error");
      }
    } else if (value === "C") {
      // if display already 0 → clear history
      if (display === "0") {
        setHistory([]);
      }

      setDisplay("0");
    } else {
      // prevent typing after error
      if (display === "Error") {
        setDisplay(value);
      } else {
        setDisplay(display === "0" ? value : display + value);
      }
    }
  };

  const buttons = ["C", "/", "*", "-", "7", "8", "9", "+", "4", "5", "6", "=", "1", "2", "3", "0"];

  return (
    <SafeAreaView style={styles.container}>
      {/* History */}
      <View style={styles.historyContainer}>
        {history.slice(0, 5).map((item, index) => (
          <Text key={index} style={styles.historyText}>
            {item}
          </Text>
        ))}
      </View>

      {/* Display */}
      <View style={styles.displayContainer}>
        <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
          {display}
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.grid}>
        {buttons.map((btn) => {
          const isOperator = ["/", "*", "-", "+", "="].includes(btn);
          const isClear = btn === "C";

          return (
            <TouchableOpacity
              key={btn}
              activeOpacity={0.7}
              style={[styles.button, isOperator && styles.operatorButton, isClear && styles.specialButton]}
              onPress={() => handlePress(btn)}
            >
              <Text style={[styles.btnText, isClear && styles.specialBtnText]}>{btn}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "flex-end",
    paddingBottom: 20,
  },

  historyContainer: {
    paddingHorizontal: 30,
    marginBottom: 10,
    alignItems: "flex-end",
  },

  historyText: {
    color: "#AAAAAA",
    fontSize: 18,
  },

  displayContainer: {
    paddingHorizontal: 30,
    paddingBottom: 30,
    alignItems: "flex-end",
  },

  displayText: {
    fontSize: 90,
    color: "#FFFFFF",
    fontWeight: "200",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },

  button: {
    width: buttonSize,
    height: buttonSize,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: buttonSize / 2,
    backgroundColor: "#333333",
  },

  operatorButton: {
    backgroundColor: "#FF9500",
  },

  specialButton: {
    backgroundColor: "#A5A5A5",
  },

  btnText: {
    fontSize: 32,
    color: "#FFFFFF",
    fontWeight: "500",
  },

  specialBtnText: {
    color: "#000000",
  },
});
