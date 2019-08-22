var re = require('re');
var argparse = require('argparse');
var time = require('time');
var uuid = require('uuid');
var json = require('json');

parser = argparse.ArgumentParser();
parser.add_argument('--file', metavar='f', type=str, help='The input file', dest='file');

PLAYER_REGEX = re.compile('([A-Za-z]*)(?:\:[ ]*")(.*)(?:")');
TURN_COUNT_REGEX = re.compile('([\w ]*(?=:)).*(?:Turn count: )(\d{1,3})');
TURN_DURATION_REGEX = re.compile('([0-9]{1,2}\.[0-9]{2})(?:.*)([0-9]{1,2}\.[0-9]{2})');
DAMAGE_REGEX = re.compile('(\d{1,4})(?: \()?(\d{1,2}(?= kill))?.*(?: to )([\w -]*)');

TURN_DEFAULTS = {
    'player': '',
    'shots_fired': 0,
    'weapon': '',
    'ninja_ropes_fired': 0,
    'damage_dealt': 0,
    'kills': 0,
    'duration': 0,
    'retreat_duration': 0,
    'loss_of_control': false,
    'time': ''
};


function load_log(filename) {
    with open(filename, 'r', encoding='utf-8', errors='ignore') as logfile) {
        text = logfile.read();
    }
    return text.split('\n');
}

function get_players(events) {
    players = {};
    id_to_player = {};
    for (event in events) {
        candidate_uuid = String(uuid.uuid4());
        if (event != '') {
            // print(event)
            pair = PLAYER_REGEX.findall(event);
            players[pair[0][1]] = {
                'colour': pair[0][0],
                'id': candidate_uuid
            };
            id_to_player[candidate_uuid] = pair[0][1];
        } else {
            break;
    return players, id_to_player;
        }

function get_turn_count(events, players) {
    index = events.index('Team time totals:') + 1;
    while (events[index] != '') {
        counts = TURN_COUNT_REGEX.findall(events[index]);
        players[counts[0][0]]['turn_count'] = Number(counts[0][1]);
        index += 1;
    return players;
    }

function get_sorted_list_of_players(player_info) {
    function _get_num_spaces(element) {
        try {
            return element.count(' ');
        } catch ( Exception) {
            return 0;
        }
    players = list(player_info.keys());
    players.sort(key=_get_num_spaces, reverse=true);
    ids = [player_info[player]['id'] for (player in players];
    return players, ids;
    }

function replace_player_names(event, sorted_players, player_info) {
    for (player in sorted_players) {
        event = event.replace(player, player_info[player]['id']);
    }
    return event;
}

function prepare_events(events, player_info, sorted_players) {
    new_events = [];
    for (event in events) {
        new_events.push(replace_player_names(event, sorted_players, player_info));
    }
    return new_events;
}

function parse_time(time_string) {
    return time.strptime(time_string.strip('[]'), '%H:%M:%S.%f');
}

function parse_events(events, player_info, sorted_players, id_to_player, sorted_ids) {
    // # Remove names to avoid duplicates causing issues
    // events = prepare_events(events)
}
    // Duplicate list of IDs to track 'rounds'
    current_ids = sorted_ids.copy();
}
    // Define output variables
    all_turns = [];
    all_rounds = [];
}
    // Define initial intermediate variables (possibly to be a function?)
    current_round = [];
    current_turn = {};
    }
    // Get first event
    current_event = events.pop(0);
    // Replace names with uuids
    current_event = replace_player_names(;
        current_event,
        sorted_players,
        player_info;
    );
    // Split into words (for easier parsing of common actions)
    current_event = [current_event.split(' '), current_event];
}
    while (current_event[1] != '') {
        // Get action and attempt to get item
        action = current_event[0][3];
        try {
            item = current_event[0][4];
        } catch ( IndexError) {
            break;
        }
        if (action == 'starts') {
            // Append prior turn
            all_turns.push(current_turn);
            current_round.push(current_turn);
            current_player_id = current_event[0][2];
        }
            // If all players have played, append round and reset round
            if (len(current_ids) == 0)) {
                // print('sorted_ids: {}'.format(sorted_ids))
                all_rounds.push(current_round);
                current_round = [];
                current_ids = sorted_ids.copy();
            }
            // Track remaining turns & discard player if no turns remain
            // print(player_info[id_to_player[current_player_id]])
            player_info[id_to_player[current_player_id]]['turn_count'] -= 1;
            if (player_info[id_to_player[current_player_id]]['turn_count'] < 1:               // print('wah')
                sorted_ids.remove(current_player_id);

            try {
                current_ids.remove(current_player_id);
            } catch (e) {
                console.log('Failed to remove');
                exit();
            }
            // Reset turn
            current_turn = TURN_DEFAULTS.copy();

            // Store player name & id for turn
            current_turn['player'] = current_player_id;
            current_turn['player_name'] = id_to_player[current_player_id];

            // Store turn start time
            current_turn['time'] = parse_time(current_event[0][0]);

        } else if (action == 'fires' && item != 'Ninja') {
            current_turn['weapon'] = item;
            current_turn['shots_fired'] += 1;

        } else if (item == 'Ninja') {
            current_turn['ninja_ropes_fired'] += 1;

        } else if (action == 'ends' || action == 'loses') {
            timings = TURN_DURATION_REGEX.findall(current_event[1]
                                                  .split(' time used: ')[1]);
            current_turn['duration'] = float(timings[0][0]);
            current_turn['retreat_duration'] = float(timings[0][1])  // Possibly worth moving to int(timings[0][1].strip('.')) to avoid any float inaccuracy and handle SS.ff formatting at render time.

        } else if (action == 'dealt:') {
            dealings = current_event[1].split('dealt: ')[1];
            for (player_damaged in DAMAGE_REGEX.findall(dealings)) {
                kills = player_damaged[1];
                current_turn['damage_dealt'] += Number(player_damaged[0]);
                if (kills != '') {
                    current_turn['kills'] += Number(kills);
                // something needs doing with tracking player damage over time here, but
                // due to lack of worm count prior knowledge, not sure best approach

        } else {
            console.log(action);
                }
        // PREPARE FOR NEXT TURN
        // Get next event
        current_event = events.pop(0);
            }
        // Replace names with uuids
        current_event = replace_player_names(;
            current_event,
            sorted_players,
            player_info;
        );
    }
        // Split into words (for easier parsing of common actions)
        current_event = [current_event.split(' '), current_event];

    return all_turns[1:-1], all_rounds;


if (__name__ == '__main__') {
    args = parser.parse_args();
}
    events = load_log(args.file);
    events_original = events;
    delete events[0:5];

    player_info, id_to_player = get_players(events);
    player_info = get_turn_count(events, player_info);
    // print(player_info)
    sorted_players, sorted_ids = get_sorted_list_of_players(player_info);

    del(events[0:events.index('')+1]);

    parsed_turns, parsed_rounds = parse_events(events, player_info, sorted_players, id_to_player, sorted_ids);
    // print(json.dumps(parsed_turns[0:10], indent=4, sort_keys=True))
    console.log(json.dumps(parsed_rounds, indent=4, sort_keys=true));
    // print(id_to_player)
