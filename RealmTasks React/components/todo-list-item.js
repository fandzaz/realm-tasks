////////////////////////////////////////////////////////////////////////////
//
// Copyright 2016 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

'use strict';

import React from 'react';

import {
    Platform,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

import RealmTasks from '../realm-tasks';
import styles from './styles';

const iOS = (Platform.OS == 'ios');

export default class TodoListItem extends React.Component {
    constructor(props) {
        super(props);

        this._onChangeText = this._onChangeText.bind(this);
    }

    get completed() {
        let items = this.props.item.items;
        return items.length > 0 && items.every((item) => item.completed);
    }

    get text() {
        return this.props.item.text;
    }

    set text(text) {
        this.props.item.text = text;
    }

    componentDidMount() {
        // The autoFocus prop on TextInput was not working for us :(
        this._focusInputIfNecessary();
    }

    componentDidUpdate() {
        this._focusInputIfNecessary();
    }


    render() {
        const i8 = this.props.index<7 ? this.props.index : 6;
        return (
            <View style={ [ styles.listItem, styles['realmColor'+i8] ] }>
                {this.renderLeftSide()}
                {this.renderText()}
                {this.renderRightSide()}
            </View>
        );
    }

    renderLeftSide() {
        return (
            <View style={styles.listItemLeftSide}>
                <Text>{this.completed ? '✓' : '⁃'}</Text>
            </View>
        );
    }

    renderRightSide() {
        // Only show the delete button while not editing the text.
        return this.props.editing ? null : this.renderDelete();
    }

    renderText(extraStyle) {
        if (this.props.editing) {
            return (
                <TextInput
                    ref="input"
                    value={this.text}
                    placeholder="Todo…"
                    style={[styles.listItemInput, extraStyle]}
                    onChangeText={this._onChangeText}
                    onEndEditing={this.props.onEndEditing}
                    enablesReturnKeyAutomatically={true} />
            );
        } else {
            return (
                <Text
                    style={[styles.listItemText, extraStyle]}
                    onPress={this.props.onPress}
                    suppressHighlighting={true}>
                    {this.text}
                </Text>
            );
        }
    }

    renderDelete() {
        return (
            <TouchableWithoutFeedback onPress={this.props.onPressDelete}>
                <View style={styles.listItemDelete}>
                    <Text>{iOS ? '𐄂' : '×'}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    _onChangeText(text) {
        RealmTasks.realm.write(() => {
            this.text = text;
        });

        this.forceUpdate();
    }

    _focusInputIfNecessary() {
        if (!this.props.editing) {
            return;
        }

        let input = this.refs.input;
        if (!input.isFocused()) {
            input.focus();
        }
    }
}
