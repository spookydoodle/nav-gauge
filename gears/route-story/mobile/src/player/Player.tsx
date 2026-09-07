import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { OverlayComponentProps } from "@apparatus";
import { useTheme } from "@ui";
import { useSubjectState } from "@tinker-chest";
import { Divider } from "@mobile-ui";
import { MobileMap } from "@mobile-apparatus";
import { RecordingButtons } from "./RecordingButtons";
import { PlayButton } from "./player-slider/PlayButton";
import { SliderWithMarkers } from "./player-slider/SliderWithMarkers";
import { MarkerButton } from "./player-slider/MarkerButton";
import { MobileRouteStoryProps } from "../model";

const styles = StyleSheet.create({
    player: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 10,
        paddingHorizontal: 15,
    },
    sm: {
        flexDirection: "column",
        alignItems: "stretch",
        marginBottom: 10,
        rowGap: 10,
    },
    slider: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        columnGap: 18,
    },
    sliderBlock: {
        flex: 1,
        marginTop: 24,
    },
    buttons: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 10,
        paddingTop: 10,
    },
    buttonGroup: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        columnGap: 10,
    },
    buttonGroupEnd: {
        justifyContent: "flex-end",
    },
});

export const Player: FC<OverlayComponentProps<MobileMap> & MobileRouteStoryProps> = ({
    gearId,
    translationKey,
    map,
    data$,
    images$,
    state$,
    routeTimes$,
    progressMs$,
    playerOperator,
    animatrix,
}) => {
    const theme = useTheme();
    const [media] = useSubjectState(theme.media$);

    const recordingButtons = (
        <RecordingButtons
            gearId={gearId}
            translationKey={translationKey}
            map={map}
            playerOperator={playerOperator}
        />
    );
    const playButton = <PlayButton gearId={gearId} translationKey={translationKey} playerOperator={playerOperator} />;
    const sliderWithMarkers = (
        <SliderWithMarkers
            gearId={gearId}
            translationKey={translationKey}
            map={map}
            data$={data$}
            routeTimes$={routeTimes$}
            images$={images$}
            progressMs$={progressMs$}
            playerOperator={playerOperator}
            animatrix={animatrix}
        />
    );
    const markerButton = <MarkerButton gearId={gearId} translationKey={translationKey} playerOperator={playerOperator} />;

    if (media.isLessThanMd) {
        return (
            <View style={[styles.player, styles.sm]}>
                <View style={styles.buttons}>
                    <View style={styles.buttonGroup}>
                        {recordingButtons}
                    </View>
                    {playButton}
                    <View style={[styles.buttonGroup, styles.buttonGroupEnd]}>
                        {markerButton}
                    </View>
                </View>
                <View style={styles.slider}>
                    {sliderWithMarkers}
                </View>
            </View>
        );
    }

    return (
        <View style={styles.player}>
            {recordingButtons}
            <Divider color="neutral" orientation="vertical" mh="xs" mv="lg" />
            <View style={styles.slider}>
                {playButton}
                <View style={styles.sliderBlock}>
                    {sliderWithMarkers}
                </View>
                {markerButton}
            </View>
        </View>
    );
};
