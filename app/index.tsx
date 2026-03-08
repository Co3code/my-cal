import { evaluate } from "mathjs";
import React, { useState } from "react";
import {
  Dimensions,
  LayoutAnimation,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

// Enable LayoutAnimation for Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width, height } = Dimensions.get("window");
const buttonSize = (width - 60) / 4;

export default function App() {
  const [display, setDisplay] = useState("0");
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isScientific, setIsScientific] = useState(false);

  const toggleHistory = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowHistory(!showHistory);
  };

  const handlePress = (value: string) => {
    if (value === "⌫") {
      setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
    } else if (value === "=") {
      try {
        // mathjs handles strings like "sin(45)" or "sqrt(16)"
        const result = evaluate(display.replace("√", "sqrt").replace("π", "pi"));
        const formatted = Number.isInteger(result) ? result.toString() : result.toFixed(4);
        setHistory([`${display} = ${formatted}`, ...history]);
        setDisplay(formatted);
      } catch {
        setDisplay("Error");
      }
    } else if (value === "C") {
      setDisplay("0");
    } else if (value === "Sci") {
      setIsScientific(!isScientific);
    } else {
      // Logic for scientific functions to include parentheses
      const sciFuncs = ["sin", "cos", "tan", "sqrt"];
      let valToAdd = value;
      if (sciFuncs.includes(value)) valToAdd = `${value}(`;

      setDisplay(display === "0" ? valToAdd : display + valToAdd);
    }
  };

  const standardButtons = [
    "C",
    "⌫",
    "Sci",
    "/",
    "7",
    "8",
    "9",
    "*",
    "4",
    "5",
    "6",
    "-",
    "1",
    "2",
    "3",
    "+",
    "0",
    ".",
    "=",
  ];

  const scientificButtons = [
    "sin",
    "cos",
    "tan",
    "sqrt",
    "π",
    "(",
    ")",
    "^",
    "7",
    "8",
    "9",
    "/",
    "4",
    "5",
    "6",
    "*",
    "1",
    "2",
    "3",
    "-",
    "0",
    ".",
    "C",
    "+",
    "=",
    "Sci",
  ];

  const currentButtons = isScientific ? scientificButtons : standardButtons;

  return (
    <SafeAreaView style={styles.container}>
      {/* Swipe/Pull-down History Panel */}
      <View style={[styles.historyPanel, { height: showHistory ? height * 0.4 : 40 }]}>
        <TouchableOpacity style={styles.pullBarContainer} onPress={toggleHistory}>
          <View style={styles.pullBar} />
          <Text style={styles.pullBarText}>{showHistory ? "Hide History" : "View History"}</Text>
        </TouchableOpacity>

        {showHistory && (
          <ScrollView style={styles.historyList}>
            {history.map((item, i) => (
              <Text key={i} style={styles.historyItem}>
                {item}
              </Text>
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.displayContainer}>
        <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
          {display}
        </Text>
      </View>

      <View style={styles.grid}>
        {currentButtons.map((btn) => {
          const isSciOp = ["sin", "cos", "tan", "sqrt", "π", "Sci"].includes(btn);
          const isOrange = ["/", "*", "-", "+", "="].includes(btn);
          const isZero = btn === "0" && !isScientific;

          return (
            <TouchableOpacity
              key={btn}
              style={[
                styles.button,
                isScientific && styles.sciButtonSize,
                isOrange && styles.orangeBtn,
                isSciOp && styles.sciBtn,
                isZero && styles.zeroBtn,
              ]}
              onPress={() => handlePress(btn)}
            >
              <Text style={styles.btnText}>{btn}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },

  // History Panel Styles
  historyPanel: {
    backgroundColor: "#1C1C1E",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
    zIndex: 10,
  },
  pullBarContainer: {
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  pullBar: {
    width: 40,
    height: 5,
    backgroundColor: "#666",
    borderRadius: 3,
  },
  pullBarText: { color: "#666", fontSize: 10, marginTop: 2 },
  historyList: { padding: 20 },
  historyItem: { color: "#AAA", fontSize: 18, textAlign: "right", marginBottom: 10 },

  displayContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 20,
  },
  displayText: { fontSize: 70, color: "#FFF", fontWeight: "300" },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    paddingBottom: 20,
  },
  button: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  sciButtonSize: {
    width: (width - 70) / 4, // Smaller buttons to fit more on screen
    height: (width - 70) / 5,
    borderRadius: 10,
  },
  orangeBtn: { backgroundColor: "#FF9500" },
  sciBtn: { backgroundColor: "#444" },
  zeroBtn: { width: buttonSize * 2 + 10, alignItems: "flex-start", paddingLeft: 30 },
  btnText: { color: "#FFF", fontSize: 20, fontWeight: "500" },
});
