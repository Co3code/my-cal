import { evaluate } from "mathjs";
import React, { useState } from "react";
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");
// Adjusting size to account for gap/spacing
const buttonSize = (width - 60) / 4;

export default function App() {
  const [display, setDisplay] = useState("0");
  const [history, setHistory] = useState<string[]>([]);

  const handlePress = (value: string) => {
    if (value === "⌫") {
      if (display.length > 1) {
        setDisplay(display.slice(0, -1));
      } else {
        setDisplay("0");
      }
      return;
    }

    if (value === "=") {
      try {
        const result = evaluate(display);
        const numResult = Number(result);
        const formattedResult = Number.isInteger(numResult) ? numResult.toString() : numResult.toFixed(4);

        setHistory((prev) => [`${display} = ${formattedResult}`, ...prev]);
        setDisplay(formattedResult);
      } catch {
        setDisplay("Error");
      }
    } else if (value === "C") {
      if (display === "0") setHistory([]);
      setDisplay("0");
    } else {
      if (display === "Error") {
        setDisplay(value);
      } else {
        // Prevent multiple leading zeros
        if (display === "0" && value !== ".") {
          setDisplay(value);
        } else {
          setDisplay(display + value);
        }
      }
    }
  };

  // Re-arranged for standard 4-column layout
  const buttons = ["C", "⌫", "%", "/", "7", "8", "9", "*", "4", "5", "6", "-", "1", "2", "3", "+", "0", ".", "="];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.historyContainer}>
        {history.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => setDisplay(item.split("=")[1].trim())}>
            <Text style={styles.historyText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.displayContainer}>
        <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
          {display}
        </Text>
      </View>

      <View style={styles.grid}>
        {buttons.map((btn) => {
          const isOperator = ["/", "*", "-", "+", "="].includes(btn);
          const isSpecial = ["C", "⌫", "%"].includes(btn);
          const isZero = btn === "0";

          return (
            <TouchableOpacity
              key={btn}
              activeOpacity={0.7}
              style={[
                styles.button,
                isOperator && styles.operatorButton,
                isSpecial && styles.specialButton,
                isZero && styles.zeroButton, // Special style for '0'
              ]}
              onPress={() => handlePress(btn)}
            >
              <Text
                style={[
                  styles.btnText,
                  isSpecial && styles.specialBtnText,
                  isZero && { textAlign: "left", paddingLeft: 30, width: "100%" },
                ]}
              >
                {btn}
              </Text>
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
    maxHeight: 120,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  historyText: {
    color: "#AAAAAA",
    fontSize: 18,
    textAlign: "right",
    marginBottom: 5,
  },
  displayContainer: {
    paddingHorizontal: 30,
    paddingBottom: 20,
    alignItems: "flex-end",
  },
  displayText: {
    fontSize: 80,
    color: "#FFFFFF",
    fontWeight: "300",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 10,
    rowGap: 12,
    columnGap: 12,
  },
  button: {
    width: buttonSize,
    height: buttonSize,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: buttonSize / 2,
    backgroundColor: "#333333",
  },
  zeroButton: {
    width: buttonSize * 2 + 12, // Double width plus the gap
    alignItems: "flex-start",
  },
  operatorButton: {
    backgroundColor: "#FF9500",
  },
  specialButton: {
    backgroundColor: "#A5A5A5",
  },
  btnText: {
    fontSize: 30,
    color: "#FFFFFF",
    fontWeight: "500",
    textAlign: "center",
  },
  specialBtnText: {
    color: "#000000",
  },
});
