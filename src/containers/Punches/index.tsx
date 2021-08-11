import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Text,
  View,
  Alert,
  SectionList,
  SectionListData,
  SectionListRenderItem,
} from "react-native";
import {
  BaseButton,
  BorderlessButton,
  RectButton,
} from "react-native-gesture-handler";
import Animated, {
  AnimatedLayout,
  FadeInDown,
  FadeInUp,
  FadeOut,
  FadeOutUp,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useAppDispatch, useAppSelector } from "../../redux";
import {
  addDate,
  PunchRecord,
  punchIn,
  punchOut,
  createSelectSectionedPunches,
  createSelectYearData,
} from "../../redux/punches";
import { PunchesNavigationProps } from "../../types/navigation";
import { colors, monthNames } from "../../utils/constants";
import { calculateHours, formatDate } from "../../utils/functions";
import styles, { ITEM_HEIGHT, SEPARATOR_HEIGHT } from "./styles";

const AnimatedBaseButton = Animated.createAnimatedComponent(BaseButton);

const Punches = ({ navigation }: PunchesNavigationProps) => {
  const SectionListRef = useRef<SectionList>(null);
  const [showMore, setShowMore] = useState(false);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [dataYear, setDataYear] = useState(new Date().getFullYear());

  const sectionedData = useAppSelector(createSelectSectionedPunches(dataYear));
  const rawYearData = useAppSelector(createSelectYearData(dataYear));
  const dispatch = useAppDispatch();

  const createDay = () => {
    const today = new Date();
    const matches = rawYearData[today.getMonth()].find(
      (date) => new Date(date.date).getDate() === today.getDate(),
    );

    if (!matches) {
      dispatch(addDate());
    } else {
      Alert.alert(
        "Work day already exists for today",
        "You've already added a work day for today, try again on another day.",
        [
          {
            text: "ok",
          },
        ],
      );
    }
  };

  const handleCalculateHours = () => {
    setShowMore(false);
  };

  const renderSectionHeader = ({
    section: { month, data },
  }: {
    section: SectionListData<PunchRecord>;
  }) => {
    return (
      <Text style={styles.sectionHeader}>
        {month} {new Date(data[0].date).getFullYear()}
      </Text>
    );
  };

  const renderItem: SectionListRenderItem<PunchRecord> = ({ item, index }) => {
    const rawDate = new Date(item.date);
    const rawPunchIn = new Date(item.punchIn ?? 0);
    const rawPunchOut = new Date(item.punchOut ?? 0);
    const date = formatDate(rawDate);

    return (
      <RectButton
        onPress={() => {
          navigation.navigate("Edit Punch", {
            index,
            month: rawDate.getMonth(),
            year: dataYear,
          });
        }}
        style={styles.itemContainer}
      >
        <View style={styles.dateContainer}>
          <Text
            style={styles.date}
          >{`${date.day}${date.suffix}, ${date.dayOfWeek}.`}</Text>
          {item.notes && item.notes.length > 15 ? (
            <Text style={styles.dayOfWeek}>{item.notes.substr(0, 15)}...</Text>
          ) : (
            item.notes && <Text style={styles.dayOfWeek}>{item.notes}</Text>
          )}
        </View>
        <View style={styles.punchContainer}>
          {rawPunchIn.getTime() === 0 ? (
            <>
              <RectButton
                onPress={() =>
                  dispatch(
                    punchIn({
                      index,
                      month: rawDate.getMonth(),
                      year: rawDate.getFullYear(),
                    }),
                  )
                }
                style={[
                  styles.punchItem,
                  { backgroundColor: colors.SECONDARY_GREEN },
                ]}
              >
                <Icon
                  name={"login"}
                  size={32}
                  style={{ color: colors.BLACK }}
                />
              </RectButton>
              <View style={{ width: 15 }} />
              <RectButton
                onPress={() =>
                  Alert.alert(
                    "Punch-In Missing",
                    "You must punch in before you can punch out.",
                    [
                      {
                        text: "ok",
                      },
                    ],
                  )
                }
                style={[
                  styles.punchItem,
                  { backgroundColor: colors.SECONDARY_RED },
                ]}
              >
                <Icon
                  name={"logout"}
                  size={32}
                  style={{ color: colors.BLACK }}
                />
              </RectButton>
            </>
          ) : rawPunchOut.getTime() === 0 ? (
            <>
              <View style={styles.punchItem}>
                <Icon
                  name={"login"}
                  size={32}
                  style={{ color: colors.SECONDARY_GREEN }}
                />
                <Text style={styles.time}>{formatDate(rawPunchIn).time}</Text>
              </View>
              <View style={{ width: 15 }} />
              <RectButton
                onPress={() =>
                  dispatch(
                    punchOut({
                      index,
                      month: rawDate.getMonth(),
                      year: rawDate.getFullYear(),
                    }),
                  )
                }
                style={[
                  styles.punchItem,
                  { backgroundColor: colors.SECONDARY_RED },
                ]}
              >
                <Icon
                  name={"logout"}
                  size={32}
                  style={{ color: colors.BLACK }}
                />
              </RectButton>
            </>
          ) : (
            <>
              <View style={styles.punchItem}>
                <Icon
                  name={"login"}
                  size={32}
                  style={{ color: colors.SECONDARY_GREEN }}
                />
                <Text style={styles.time}>{formatDate(rawPunchIn).time}</Text>
              </View>
              <View style={styles.punchItem}>
                <Icon
                  name={"logout"}
                  size={32}
                  style={{ color: colors.SECONDARY_RED }}
                />
                <Text style={styles.time}>{formatDate(rawPunchOut).time}</Text>
              </View>
              <View style={styles.punchItem}>
                <Icon
                  name={"schedule"}
                  size={32}
                  style={{ color: colors.SECONDARY_PURPLE }}
                />
                <Text style={styles.time}>
                  {calculateHours(rawPunchIn, rawPunchOut)}
                </Text>
              </View>
            </>
          )}
        </View>
      </RectButton>
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: ({ pressColor, pressOpacity }) => (
        <BorderlessButton
          activeOpacity={pressOpacity}
          onPress={() => setShowMore(!showMore)}
          rippleColor={pressColor}
        >
          <Icon color={colors.PRIMARY_WHITE} name={"more-vert"} size={28} />
        </BorderlessButton>
      ),
    });
  }, [navigation, showMore]);

  useEffect(() => {
    const today = new Date();
    const monthData = rawYearData[today.getMonth()];
    const sectionIndex = sectionedData.findIndex(
      (section) => section.month === monthNames[today.getMonth()],
    );
    SectionListRef.current?.scrollToLocation({
      animated: true,
      itemIndex: monthData.length,
      sectionIndex,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawYearData]);

  return (
    <AnimatedLayout style={{ flex: 1 }}>
      <SectionList
        stickySectionHeadersEnabled
        extraData={rawYearData.length}
        getItemLayout={(_, index) => ({
          index,
          length: ITEM_HEIGHT,
          offset: (ITEM_HEIGHT + SEPARATOR_HEIGHT) * index,
        })}
        ItemSeparatorComponent={() => (
          <View style={{ height: SEPARATOR_HEIGHT }} />
        )}
        keyExtractor={(item, index) => `${item.date}${item.punchIn}${index}`}
        ref={SectionListRef}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        sections={sectionedData}
        SectionSeparatorComponent={() => (
          <View style={{ height: SEPARATOR_HEIGHT }} />
        )}
        showsVerticalScrollIndicator={false}
      />
      {showMore && (
        <AnimatedBaseButton
          entering={FadeInUp.duration(150)}
          exiting={FadeOutUp.duration(150)}
          onPress={() => setShowMore(false)}
          rippleColor={"transparent"}
          style={{
            height: "100%",
            position: "absolute",
            width: "100%",
          }}
        >
          <Animated.View style={styles.moreContainer}>
            <RectButton onPress={handleCalculateHours}>
              <Text style={styles.moreText}>Calculate Hours</Text>
            </RectButton>
            <RectButton
              onPress={() => setDataYear(dataYear === 2021 ? 2022 : 2021)}
            >
              <Text style={styles.moreText}>Change Year</Text>
            </RectButton>
          </Animated.View>
        </AnimatedBaseButton>
      )}
      {showAddOptions && (
        <AnimatedBaseButton
          entering={FadeInDown.duration(150)}
          exiting={FadeOut.duration(150)}
          onPress={() => setShowAddOptions(false)}
          rippleColor={"transparent"}
          style={{
            backgroundColor: "rgba(0,0,0,0.25)",
            height: "100%",
            position: "absolute",
            width: "100%",
          }}
        >
          <Animated.View
            style={{
              backgroundColor: colors.SECONDARY_PURPLE,
              borderColor: colors.PRIMARY_PURPLE,
              borderLeftWidth: 4,
              borderRightWidth: 4,
              borderTopWidth: 4,
              bottom: ITEM_HEIGHT,
              position: "absolute",
              width: "100%",
            }}
          >
            <RectButton
              onPress={() => {
                setShowAddOptions(false);
                createDay();
              }}
              style={styles.button}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                }}
              >
                Quick Add
              </Text>
            </RectButton>
            <View
              style={{ backgroundColor: colors.PRIMARY_PURPLE, height: 2 }}
            />
            <RectButton
              onPress={() => {
                setShowAddOptions(false);
                navigation.navigate("Manual Punch");
              }}
              style={styles.button}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                }}
              >
                Custom Day
              </Text>
            </RectButton>
          </Animated.View>
        </AnimatedBaseButton>
      )}
      <Animated.View style={styles.newDateWrapper}>
        <RectButton
          onPress={() => setShowAddOptions(!showAddOptions)}
          style={styles.button}
        >
          <Icon color={colors.PRIMARY_WHITE} name={"add"} size={50} />
        </RectButton>
      </Animated.View>
    </AnimatedLayout>
  );
};

export default Punches;
