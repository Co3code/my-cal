import { cos, evaluate, pi, sin, tan } from "mathjs";
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
  const [isDegree, setIsDegree] = useState(true);

  const toggleHistory = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowHistory(!showHistory);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const handlePress = (value: string) => {
    if (value === "⌫") {
      setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
    } else if (value === "Deg" || value === "Rad") {
      setIsDegree(!isDegree);
    } else if (value === "Sci") {
      setIsScientific(!isScientific);
    } else if (value === "C") {
      setDisplay("0");
    } else if (value === "=") {
      try {
        let expression = display.replace("√", "sqrt").replace("π", "pi");

        const scope = {
          sin: (x: number) => (isDegree ? sin((x * pi) / 180) : sin(x)),
          cos: (x: number) => (isDegree ? cos((x * pi) / 180) : cos(x)),
          tan: (x: number) => (isDegree ? tan((x * pi) / 180) : tan(x)),
        };

        const result = evaluate(expression, scope);
        const formatted = Number.isInteger(result) ? result.toString() : result.toFixed(4);

        // Only show (Deg/Rad) if sin, cos, or tan is in the expression
        const needsLabel = /sin|cos|tan/.test(display);
        const label = needsLabel ? ` (${isDegree ? "Deg" : "Rad"})` : "";

        setHistory([`${display}${label} = ${formatted}`, ...history]);
        setDisplay(formatted);
      } catch {
        setDisplay("Error");
      }
    } else {
      const sciFuncs = ["sin", "cos", "tan", "sqrt"];
      let valToAdd = sciFuncs.includes(value) ? `${value}(` : value;
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
    isDegree ? "Deg" : "Rad",
    "0",
    ".",
    "+",
    "C",
    "Sci",
    "=",
  ];

  const currentButtons = isScientific ? scientificButtons : standardButtons;

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.historyPanel, { height: showHistory ? height * 0.4 : 45 }]}>
        <TouchableOpacity style={styles.pullBarContainer} onPress={toggleHistory}>
          <View style={styles.pullBar} />
          <Text style={styles.pullBarText}>{showHistory ? "CLOSE" : "HISTORY"}</Text>
        </TouchableOpacity>

        {showHistory && (
          <View style={{ flex: 1 }}>
            <ScrollView style={styles.historyList}>
              {history.length === 0 ? (
                <Text style={styles.emptyText}>No History</Text>
              ) : (
                history.map((item, i) => (
                  <Text key={i} style={styles.historyItem}>
                    {item}
                  </Text>
                ))
              )}
            </ScrollView>
            {history.length > 0 && (
              <TouchableOpacity style={styles.clearBtn} onPress={clearHistory}>
                <Text style={styles.clearBtnText}>Clear All History</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <View style={styles.indicatorRow}>
        {isScientific && <Text style={styles.indicatorText}>{isDegree ? "DEG" : "RAD"}</Text>}
      </View>

      <View style={styles.displayContainer}>
        <Text style={styles.displayText} numberOfLines={2} adjustsFontSizeToFit>
          {display}
        </Text>
      </View>

      <View style={styles.grid}>
        {currentButtons.map((btn) => (
          <TouchableOpacity
            key={btn}
            style={[
              styles.button,
              isScientific && styles.sciButtonSize,
              ["/", "*", "-", "+", "="].includes(btn) && styles.orangeBtn,
              ["C", "⌫", "Sci", "Deg", "Rad"].includes(btn) && styles.specialBtn,
              btn === "0" && !isScientific && styles.zeroBtn,
            ]}
            onPress={() => handlePress(btn)}
          >
            <Text style={[styles.btnText, isScientific && { fontSize: 18 }]}>{btn}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  historyPanel: { backgroundColor: "#1C1C1E", borderBottomLeftRadius: 25, borderBottomRightRadius: 25, zIndex: 10 },
  pullBarContainer: { height: 45, alignItems: "center", justifyContent: "center" },
  pullBar: { width: 40, height: 4, backgroundColor: "#555", borderRadius: 2, marginBottom: 4 },
  pullBarText: { color: "#888", fontSize: 10, fontWeight: "bold" },
  historyList: { paddingHorizontal: 20, flex: 1 },
  historyItem: { color: "#D4D4D2", fontSize: 18, textAlign: "right", marginVertical: 8 },
  emptyText: { color: "#555", textAlign: "center", marginTop: 20 },
  clearBtn: { padding: 15, alignItems: "center", borderTopWidth: 1, borderTopColor: "#333" },
  clearBtnText: { color: "#FF3B30", fontWeight: "600" },
  indicatorRow: { paddingHorizontal: 30, height: 20 },
  indicatorText: { color: "#FF9500", fontWeight: "bold", fontSize: 12 },
  displayContainer: { flex: 1, justifyContent: "flex-end", alignItems: "flex-end", padding: 30 },
  displayText: { fontSize: 80, color: "#FFF", fontWeight: "200" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    paddingBottom: 30,
    paddingHorizontal: 10,
  },
  button: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  sciButtonSize: { width: (width - 70) / 4, height: (width - 70) / 6, borderRadius: 12 },
  orangeBtn: { backgroundColor: "#FF9500" },
  specialBtn: { backgroundColor: "#A5A5A5" },
  zeroBtn: { width: buttonSize * 2 + 10, alignItems: "flex-start", paddingLeft: 30 },
  btnText: { color: "#FFF", fontSize: 26, fontWeight: "400" },
});
