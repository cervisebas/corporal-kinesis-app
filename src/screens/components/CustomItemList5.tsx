import React, { useState } from "react";
import { trainings } from "../../scripts/ApiCorporal/types";
import { Button, Card, IconButton } from "react-native-paper";
import { ScrollView, StyleSheet } from "react-native";
import { decode } from "base-64";
import { MiniCustomCard } from "./Components";
import moment from "moment";

type IProps14 = {
    data: trainings;
    editButton?: ()=>any;
    viewButton?: ()=>any;
    deleteButton?: ()=>any;
};

export default React.memo(function CustomItemList5(props: IProps14) {
    const date: Date = moment(decode(props.data.date), 'DD/MM/YYYY').toDate();
    const strDate: string = moment(date).format('dddd D [de] MMMM [del] YYYY');
    const defDate = strDate.charAt(0).toUpperCase() + strDate.slice(1);

    const [title] = useState(defDate);

    function iconTitle(cProps: any) {
        return(<IconButton
            {...cProps}
            icon={'trash-can-outline'}
            onPress={(props.deleteButton)&&props.deleteButton}
        />);
    }
    
    return(<Card style={styles.card} theme={{ dark: true }}>
        <Card.Title
            title={title}
            subtitle={decode(props.data.exercise.name)}
            subtitleStyle={styles.cardTitle}
            right={iconTitle}
        />
        <Card.Content>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <MiniCustomCard title={'RDS:'} value={decode(props.data.rds)} marginLeft={8} />
                <MiniCustomCard title={'RPE:'} value={decode(props.data.rpe)} />
                <MiniCustomCard title={'PULSO:'} value={decode(props.data.pulse)} />
                <MiniCustomCard title={'REPS:'} value={decode(props.data.repetitions)} />
                <MiniCustomCard title={'KLG:'} value={decode(props.data.kilage)} />
                <MiniCustomCard title={'TLG:'} value={decode(props.data.tonnage)} />
            </ScrollView>
        </Card.Content>
        <Card.Actions>
            <Button style={{ display: 'none' }} onPress={(props.editButton)&&props.editButton}>Editar</Button>
            <Button onPress={(props.viewButton)&&props.viewButton}>Ver detalles</Button>
        </Card.Actions>
    </Card>);
});

const styles = StyleSheet.create({
    card: {
        marginLeft: 8,
        marginRight: 8,
        marginTop: 12,
        height: 182
    },
    cardTitle: {
        marginLeft: 4
    }
});