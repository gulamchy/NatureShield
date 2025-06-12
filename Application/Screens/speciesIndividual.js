import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import CustomHeader from "../Components/customHeader";

export default function SpeciesIndividual() {
  const navigation = useNavigation();

  const route = useRoute();

  const CommonName = route?.params?.CommonName;
  const ScientificName = route?.params?.ScientificName;
  const Durations = route?.params?.Durations;
  const GrowthHabits = route?.params?.GrowthHabits;
  const OtherCommonNames = route?.params?.OtherCommonNames;
  const Description = route?.params?.Description;
  const imageUrl = route?.params?.image;
  const NativeStatus = route?.params?.NativeStatus;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.wrapper}>
        <CustomHeader title={CommonName} icons={[]} onIconPress={() => null} />
        <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUrl }}
              contentFit="cover"
              style={[styles.image, { aspectRatio: 1 }]}
            />
          </View>

          <View style={styles.infoContainer}>
            {/* <Text style={styles.infoText}>{scientificName}</Text> */}
            <ScrollView
              style={styles.scrollInfoContainer}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.infoInnerContainer}>
                <View style={styles.nameContent}>
                  <Text style={styles.headerText}>Scientific Name</Text>
                  <Text style={styles.infoTextHeader}>{ScientificName}</Text>
                </View>
                <View style={styles.namePercentageContent}>
                  <View style={styles.nameContent}>
                    <Text style={styles.headerText}>Durations</Text>
                    <Text style={styles.textDetails}>{Durations}</Text>
                  </View>

                  <View style={styles.nameContent}>
                    <Text style={styles.headerText}>Growth Habits</Text>
                    <Text style={styles.textDetails}>{GrowthHabits}</Text>
                  </View>

                  <View style={styles.nameContent}>
                    <Text style={styles.headerText}>Native Status</Text>
                    <Text style={styles.textDetails}>{NativeStatus}</Text>
                  </View>
                </View>

                {OtherCommonNames && (
                  <View style={styles.nameContent}>
                    <Text style={styles.headerText}>OtherCommonNames</Text>
                    <Text style={styles.textDetails}>{OtherCommonNames}</Text>
                  </View>
                )}

                <View style={styles.nameContent}>
                  <Text style={styles.headerText}>More About {CommonName}</Text>
                  <Text style={styles.descriptionDetails}>{Description}</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    backgroundColor: "#001A1A",
  },
  wrapper: {
    flex: 1,
    // paddingHorizontal: 16,
    gap: 16,
  },
  contentContainer: { flex: 1, gap: 32, paddingHorizontal: 16 },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 16,
    marginVertical: 16,
  },
  image: {
    flex: 1,
    aspectRatio: 1,
    contentFit: "cover",
    borderRadius: 16,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },

  scrollInfoContainer: {
    flex: 1,
  },
  infoInnerContainer: {
    flex: 1,
    gap: 32,
  },
  nameContent: {},
  headerText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    opacity: 0.6,
    textTransform: "uppercase",
    lineHeight: 16,
    marginBottom: 16,
  },
  namePercentageContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoTextHeader: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
  },
  textDetails: {
    fontSize: 16,
    flexWrap: "wrap",
    fontWeight: "500",
    color: "#fff",
    lineHeight: 28,
  },
  descriptionDetails: {
    fontSize: 16,
    flexWrap: "wrap",
    fontWeight: "500",
    color: "#fff",
    lineHeight: 28,
    marginBottom: 32,
  },
});
