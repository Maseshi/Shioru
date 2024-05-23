const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const {
  TwoZeroFourEight,
  Connect4,
  FastType,
  FindEmoji,
  Fishy,
  Flood,
  GuessThePokemon,
  Hangman,
  MatchPairs,
  Minesweeper,
  RockPaperScissors,
  Slots,
  Snake,
  TicTacToe,
  Trivia,
  Wordle,
  WouldYouRather,
} = require('discord-gamecord')

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('games')
    .setDescription('Mini-games that can be played instantly')
    .setDescriptionLocalizations({
      th: 'มินิเกมที่สามารถเล่นได้ในทันที',
    })
    .setDefaultMemberPermissions()
    .setDMPermission(true)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('2048')
        .setDescription('Merge same-numbered tiles to reach 2048.')
        .setDescriptionLocalizations({
          th: 'รวมช่องที่มีตัวเลขเดียวกันเพื่อไปถึง 2048.',
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('connect-4')
        .setDescription(
          'Connect four colored tiles to form a united front before your opponent.'
        )
        .setDescriptionLocalizations({
          th: 'เชื่อมต่อสี่แผ่นสีให้ได้แนวร่วมก่อนคู่ต่อสู้',
        })
        .addUserOption((option) =>
          option
            .setName('opponent')
            .setDescription('Invite or select an opponent')
            .setDescriptionLocalizations({
              th: 'เชิญหรือเลือกฝ่ายตรงข้าม',
            })
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('fast-type')
        .setDescription('Test and improve your typing speed')
        .setDescriptionLocalizations({
          th: 'ทดสอบและปรับปรุงความเร็วในการพิมพ์',
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('find-emoji')
        .setDescription('Find hidden emojis')
        .setDescriptionLocalizations({
          th: 'ค้นหาอีโมจิที่ถูกซ่อนไว้',
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('fishy')
        .setDescription('Fishing business management')
        .setDescriptionLocalizations({
          th: 'บริหารธุรกิจการตกปลา',
        })
        .addStringOption((option) =>
          option
            .setName('action')
            .setDescription('Choose what you want to do next.')
            .setDescriptionLocalizations({ th: 'เลือกสิ่งที่คุณต้องการทำต่อ' })
            .setRequired(true)
            .setChoices(
              {
                name: 'Catch Fish',
                name_localizations: {
                  th: 'จับปลา',
                },
                value: 'catch-fish',
              },
              {
                name: 'Sell Fish',
                name_localizations: {
                  th: 'ขายปลา',
                },
                value: 'sell-fish',
              },
              {
                name: 'Open Inventory',
                name_localizations: {
                  th: 'เปิดคลัง',
                },
                value: 'open-inventory',
              }
            )
        )
        .addStringOption((option) =>
          option
            .setName('sell-fish-type')
            .setDescription('What type of fish do you want to sell?')
            .setDescriptionLocalizations({ th: 'ต้องการขายปลาประเภทใด' })
            .setChoices(
              {
                name: 'Junk',
                name_localizations: {
                  th: 'ขยะ',
                },
                value: 'junk',
              },
              {
                name: 'Common',
                name_localizations: {
                  th: 'ทั่วไป',
                },
                value: 'common',
              },
              {
                name: 'Uncommon',
                name_localizations: {
                  th: 'พิเศษ',
                },
                value: 'uncommon',
              },
              {
                name: 'Rare',
                name_localizations: {
                  th: 'หายาก',
                },
                value: 'rare',
              }
            )
        )
        .addNumberOption((option) =>
          option
            .setName('sell-fish-amount')
            .setDescription('How many fish do you want to sell?')
            .setDescriptionLocalizations({ th: 'ต้องการขายปลาจำนวนเท่าใด' })
            .setMinValue(0)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('flood')
        .setDescription('Flip all colors to be the same within 25 turns.')
        .setDescriptionLocalizations({
          th: 'พลิกสีทั้งหมดให้เหมือนกันทั้งหมดภายใน 25 เทริน์',
        })
        .addStringOption((option) =>
          option
            .setName('difficulty')
            .setDescription('Choose the difficulty level of the game.')
            .setDescriptionLocalizations({
              th: 'เลือกระดับความยากของเกม',
            })
            .setChoices(
              {
                name: 'easy',
                name_localizations: {
                  th: 'ง่าย',
                },
                value: '8',
              },
              {
                name: 'normal',
                name_localizations: {
                  th: 'ปกติ',
                },
                value: '13',
              },
              {
                name: 'hard',
                name_localizations: {
                  th: 'ยาก',
                },
                value: '18',
              }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('guess-the-pokemon')
        .setDescription(
          'Guess the character or pet in Pokemon as correctly as possible.'
        )
        .setDescriptionLocalizations({
          th: 'เดาตัวละครหรือสัตว์เลี้ยงใน Pokemon ให้ถูกต้องที่สุด',
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('hangman')
        .setDescription(
          'Guess the English word before the picture of the hanging person is finished.'
        )
        .setDescriptionLocalizations({
          th: 'ทายคำภาษาอังกฤษก่อนภาพของคนถูกแขวนจะถูกวาดเสร็จ',
        })
        .addStringOption((option) =>
          option
            .setName('theme')
            .setDescription('Choose the theme of the game')
            .setDescriptionLocalizations({ th: 'เลือกธีมของเกม' })
            .setChoices(
              {
                name: 'nature',
                name_localizations: {
                  th: 'ธรรมชาติ',
                },
                value: 'nature',
              },
              {
                name: 'sport',
                name_localizations: {
                  th: 'กีฬา',
                },
                value: 'sport',
              },
              {
                name: 'color',
                name_localizations: {
                  th: 'สี',
                },
                value: 'color',
              },
              {
                name: 'camp',
                name_localizations: {
                  th: 'ค่าย',
                },
                value: 'camp',
              },
              {
                name: 'fruit',
                name_localizations: {
                  th: 'ผลไม้',
                },
                value: 'fruit',
              },
              {
                name: 'discord',
                name_localizations: {
                  th: 'ดิสคอร์ด',
                },
                value: 'discord',
              },
              {
                name: 'winter',
                name_localizations: {
                  th: 'ฤดูหนาว',
                },
                value: 'winter',
              },
              {
                name: 'pokemon',
                name_localizations: {
                  th: 'โปเกมอน',
                },
                value: 'pokemon',
              }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('match-pairs')
        .setDescription('Match the symbols that are flipped down or hidden.')
        .setDescriptionLocalizations({
          th: 'จับคู่สัญลักษณ์ที่ถูกคว้ำลงหรือซ่อนไว้ให้ตรงกัน',
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('minesweeper')
        .setDescription('Find the location of the bombs hidden on the board.')
        .setDescriptionLocalizations({
          th: 'หาตำแหน่งของระเบิดที่ซ่อนอยู่ในกระดาน',
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('rock-paper-scissors')
        .setDescription('Defeat your opponent with the symbols of your choice.')
        .setDescriptionLocalizations({
          th: 'เอาชนะฝ่ายตรงข้ามด้วยสัญลักษณ์ที่ตัวเองเลือก',
        })
        .addUserOption((option) =>
          option
            .setName('opponent')
            .setDescription('Invite or select an opponent')
            .setDescriptionLocalizations({
              th: 'เชิญหรือเลือกฝ่ายตรงข้าม',
            })
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('slots')
        .setDescription('Spin the reels to get matching patterns or symbols.')
        .setDescriptionLocalizations({
          th: 'หมุนวงล้อเพื่อให้ได้รูปแบบหรือสัญลักษณ์ที่ตรงกัน',
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('snake')
        .setDescription(
          'Eat the fruit without eating yourself and hitting the wall.'
        )
        .setDescriptionLocalizations({
          th: 'กินผลไม้โดยที่ต้องไม่กินตัวเองและชนกำแพง',
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('tic-tac-toe')
        .setDescription("Place 3 X's or O's in the same line.")
        .setDescriptionLocalizations({
          th: 'วาง X หรือ O ให้ได้แนวเดียวกัน 3 ช่อง',
        })
        .addUserOption((option) =>
          option
            .setName('opponent')
            .setDescription('Invite or select an opponent')
            .setDescriptionLocalizations({
              th: 'เชิญหรือเลือกฝ่ายตรงข้าม',
            })
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('trivia')
        .setDescription('Test your knowledge on various topics.')
        .setDescriptionLocalizations({
          th: 'ทดสอบความรู้ในหลากหลายหัวข้อ',
        })
        .addStringOption((option) =>
          option
            .setName('mode')
            .setDescription('Select game mode')
            .setDescriptionLocalizations({
              th: 'เลือกโหมดเกม',
            })
            .setChoices(
              {
                name: 'single',
                name_localizations: {
                  th: 'เดี่ยว',
                },
                value: 'single',
              },
              {
                name: 'multiple',
                name_localizations: {
                  th: 'หลายรายการ',
                },
                value: 'multiple',
              }
            )
        )
        .addStringOption((option) =>
          option
            .setName('difficulty')
            .setDescription('Choose the difficulty level of the game.')
            .setDescriptionLocalizations({
              th: 'เลือกระดับความยากของเกม',
            })
            .setChoices(
              {
                name: 'easy',
                name_localizations: {
                  th: 'ง่าย',
                },
                value: 'easy',
              },
              {
                name: 'medium',
                name_localizations: {
                  th: 'ปานกลาง',
                },
                value: 'medium',
              },
              {
                name: 'hard',
                name_localizations: {
                  th: 'ยาก',
                },
                value: 'hard',
              }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('wordle')
        .setDescription('Guess a 5-letter word in 6 tries.')
        .setDescriptionLocalizations({
          th: 'ทายคำภาษาอังกฤษ 5 ตัวอักษรใน 6 ครั้ง',
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('would-you-rather')
        .setDescription('Choose between two tough scenarios.')
        .setDescriptionLocalizations({
          th: 'เลือกระหว่างสถานการณ์ที่ยากสองอย่าง',
        })
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand()
    const inputOpponent = interaction.options.getUser('opponent')
    const inputAction = interaction.options.getString('action')
    const inputDifficulty = interaction.options.getString('difficulty')
    const inputTheme = interaction.options.getString('theme') ?? 'nature'
    const inputMode = interaction.options.getString('mode') ?? 'multiple'

    const approveOption = {
      embed: {
        requestTitle: interaction.client.i18n.t('commands.games.game_request'),
        requestColor: '#57F287',
        rejectTitle: interaction.client.i18n.t('commands.games.game_reject'),
        rejectColor: '#ED4245',
      },
      buttons: {
        accept: interaction.client.i18n.t('commands.games.accept'),
        reject: interaction.client.i18n.t('commands.games.reject'),
      },
      reqTimeoutTime: 60000,
      requestMessage: interaction.client.i18n.t(
        'commands.games.invite_to_play_game',
        {
          player: '{player}',
        }
      ),
      rejectMessage: interaction.client.i18n.t('commands.games.player_reject'),
      reqTimeoutMessage: interaction.client.i18n.t(
        'commands.games.player_not_response'
      ),
    }

    switch (subcommand) {
      case '2048': {
        const game = new TwoZeroFourEight({
          message: interaction,
          isSlashGame: true,
          embed: {
            title: '2048',
            color: '#5865F2',
          },
          emojis: {
            up: '⬆️',
            down: '⬇️',
            left: '⬅️',
            right: '➡️',
          },
          timeoutTime: 60000,
          buttonStyle: 'PRIMARY',
          playerOnlyMessage: interaction.client.i18n.t(
            'commands.games.player_only',
            {
              player: '{player}',
            }
          ),
        })

        game.startGame()
        break
      }
      case 'connect-4': {
        const game = new Connect4({
          ...{
            message: interaction,
            isSlashGame: true,
            opponent: inputOpponent,
            embed: {
              title: 'Connect 4',
              statusTitle: interaction.client.i18n.t('commands.games.status'),
              color: '#5865F2',
            },
            emojis: {
              board: '⚪',
              player1: '🔴',
              player2: '🟡',
            },
            mentionUser: true,
            timeoutTime: 60000,
            buttonStyle: 'PRIMARY',
            turnMessage: interaction.client.i18n.t(
              'commands.games.turn_to_player',
              {
                emoji: '{emoji}',
                player: '{player}',
              }
            ),
            winMessage: interaction.client.i18n.t(
              'commands.games.player_win_connect_four',
              {
                emoji: '{emoji}',
                player: '{player}',
              }
            ),
            tieMessage: interaction.client.i18n.t('commands.games.tie_game'),
            timeoutMessage: interaction.client.i18n.t(
              'commands.games.timeout_game'
            ),
            playerOnlyMessage: interaction.client.i18n.t(
              'commands.games.player_and_opponent_only',
              {
                player: '{player}',
                opponent: '{opponent}',
              }
            ),
          },
          ...approveOption,
        })

        game.startGame()
        break
      }
      case 'fast-type': {
        const response = await fetch('http://metaphorpsum.com/paragraphs/1/1')

        if (response.status !== 200)
          return interaction.reply(
            interaction.client.i18n.t('commands.games.words_api_not_response')
          )

        const data = await response.json()
        const game = new FastType({
          message: interaction,
          isSlashGame: true,
          embed: {
            title: 'Fast Type',
            color: '#5865F2',
            description: interaction.client.i18n.t(
              'commands.games.time_to_type',
              {
                time: '{time}',
              }
            ),
          },
          timeoutTime: 60000,
          sentence: data,
          winMessage: interaction.client.i18n.t(
            'commands.games.player_win_fast_type',
            {
              time: '{time}',
              wpm: '{wpm}',
            }
          ),
          loseMessage: interaction.client.i18n.t(
            'commands.games.player_lose_fast_type'
          ),
        })

        game.startGame()
        break
      }
      case 'find-emoji': {
        const game = new FindEmoji({
          message: interaction,
          isSlashGame: true,
          embed: {
            title: 'Find Emoji',
            color: '#5865F2',
            description: interaction.client.i18n.t(
              'commands.games.remember_all_emoji'
            ),
            findDescription: interaction.client.i18n.t(
              'commands.games.find_emoji',
              {
                emoji: '{emoji}',
              }
            ),
          },
          timeoutTime: 60000,
          hideEmojiTime: 5000,
          buttonStyle: 'PRIMARY',
          emojis: ['🍉', '🍇', '🍊', '🍋', '🥭', '🍎', '🍏', '🥝'],
          winMessage: interaction.client.i18n.t(
            'commands.games.correct_emoji',
            {
              emoji: '{emoji}',
            }
          ),
          loseMessage: interaction.client.i18n.t(
            'commands.games.incorrect_emoji',
            {
              emoji: '{emoji}',
            }
          ),
          timeoutMessage: interaction.client.i18n.t(
            'commands.games.forgot_emoji',
            {
              emoji: '{emoji}',
            }
          ),
          playerOnlyMessage: interaction.client.i18n.t(
            'commands.games.player_only',
            {
              player: '{player}',
            }
          ),
        })

        game.startGame()
        break
      }
      case 'fishy': {
        const inputSellFishType =
          interaction.options.getString('sell-fish-type')
        const inputSellFishAmount =
          interaction.options.getString('sell-fish-amount')

        let player = {}
        const game = new Fishy({
          message: interaction,
          isSlashGame: true,
          player: player,
          embed: {
            title: 'Fishy',
            color: '#5865F2',
          },
          fishes: {
            junk: { emoji: '🔧', price: 5 },
            common: { emoji: '🐟', price: 10 },
            uncommon: { emoji: '🐠', price: 20 },
            rare: { emoji: '🐡', price: 50 },
          },
          fishyRodPrice: 10,
          catchMessage: interaction.client.i18n.t(
            'commands.games.caught_fish',
            {
              fish: '{fish}',
              amount: '{amount}',
            }
          ),
          sellMessage: interaction.client.i18n.t('commands.games.fish_sold', {
            amount: '{amount}',
            emoji: '{emoji}',
            type: '{type}',
            fish: '{fish}',
          }),
          noBalanceMessage: interaction.client.i18n.t(
            'commands.games.no_balance'
          ),
          invalidTypeMessage: interaction.client.i18n.t(
            'commands.games.want_sell_fish_type'
          ),
          invalidAmountMessage: interaction.client.i18n.t(
            'commands.games.want_sell_fish_amount'
          ),
          noItemMessage: interaction.client.i18n.t(
            'commands.games.no_item_in_inventory'
          ),
        })

        switch (inputAction) {
          case 'catch-fish': {
            game.catchFish()
            break
          }
          case 'sell-fish': {
            game.sellFish(inputSellFishType, inputSellFishAmount)
            break
          }
          case 'open-inventory': {
            game.fishyInventory()
            break
          }
        }

        game.on('catchFish', (fishy) => {
          player = fishy.player
        })
        game.on('sellFish', (fishy) => {
          player = fishy.player
        })

        interaction.reply({
          content: interaction.client.i18n.t(
            'commands.games.experimental_economy_feature'
          ),
          ephemeral: true,
        })
        break
      }
      case 'flood': {
        const game = new Flood({
          message: interaction,
          isSlashGame: true,
          embed: {
            title: 'Flood',
            color: '#5865F2',
          },
          difficulty: inputDifficulty ? parseInt(inputDifficulty) : 13,
          timeoutTime: 60000,
          buttonStyle: 'PRIMARY',
          emojis: ['🟥', '🟦', '🟧', '🟪', '🟩'],
          winMessage: interaction.client.i18n.t(
            'commands.games.player_win_flood',
            {
              turns: '{turns}',
            }
          ),
          loseMessage: interaction.client.i18n.t(
            'commands.games.player_loose_flood',
            {
              turns: '{turns}',
            }
          ),
          playerOnlyMessage: interaction.client.i18n.t(
            'commands.games.player_only',
            {
              player: '{player}',
            }
          ),
        })

        game.startGame()
        break
      }
      case 'guess-the-pokemon': {
        const game = new GuessThePokemon({
          message: interaction,
          isSlashGame: true,
          embed: {
            title: "Who's The Pokemon",
            color: '#5865F2',
          },
          timeoutTime: 60000,
          winMessage: interaction.client.i18n.t(
            'commands.games.correct_pokemon',
            {
              pokemon: '{pokemon}',
            }
          ),
          loseMessage: interaction.client.i18n.t(
            'commands.games.incorrect_pokemon',
            {
              pokemon: '{pokemon}',
            }
          ),
          errMessage: interaction.client.i18n.t(
            'commands.games.pokemon_api_not_response'
          ),
          playerOnlyMessage: interaction.client.i18n.t(
            'commands.games.player_only',
            {
              player: '{player}',
            }
          ),
        })

        game.startGame()
        break
      }
      case 'hangman': {
        const game = new Hangman({
          message: interaction,
          isSlashGame: true,
          embed: {
            title: 'Hangman',
            color: '#5865F2',
          },
          hangman: {
            hat: '🎩',
            head: '😟',
            shirt: '👕',
            pants: '🩳',
            boots: '👞👞',
          },
          customWord: 'Gamecord',
          timeoutTime: 60000,
          theme: inputTheme,
          winMessage: interaction.client.i18n.t(
            'commands.games.player_win_hangman',
            {
              word: '{word}',
            }
          ),
          loseMessage: interaction.client.i18n.t(
            'commands.games.player_loose_hangman',
            {
              word: '{word}',
            }
          ),
          playerOnlyMessage: interaction.client.i18n.t(
            'commands.games.player_only',
            {
              player: '{player}',
            }
          ),
        })

        game.startGame()
        break
      }
      case 'match-pairs': {
        const game = new MatchPairs({
          message: interaction,
          isSlashGame: true,
          embed: {
            title: 'Match Pairs',
            color: '#5865F2',
            description: interaction.client.i18n.t(
              'commands.games.click_match_emoji'
            ),
          },
          timeoutTime: 60000,
          emojis: [
            '🍉',
            '🍇',
            '🍊',
            '🥭',
            '🍎',
            '🍏',
            '🥝',
            '🥥',
            '🍓',
            '🫐',
            '🍍',
            '🥕',
            '🥔',
          ],
          winMessage: interaction.client.i18n.t(
            'commands.games.player_win_match_pairs',
            {
              tiles_turned: '{tilesTurned}',
            }
          ),
          loseMessage: interaction.client.i18n.t(
            'commands.games.player_loose_match_pairs',
            {
              tiles_turned: '{tilesTurned}',
            }
          ),
          playerOnlyMessage: interaction.client.i18n.t(
            'commands.games.player_only',
            {
              player: '{player}',
            }
          ),
        })

        game.startGame()
        break
      }
      case 'minesweeper': {
        const game = new Minesweeper({
          message: interaction,
          isSlashGame: true,
          embed: {
            title: 'Minesweeper',
            color: '#5865F2',
            description: interaction.client.i18n.t(
              'commands.games.click_show_block'
            ),
          },
          emojis: { flag: '🚩', mine: '💣' },
          mines: 5,
          timeoutTime: 60000,
          winMessage: interaction.client.i18n.t(
            'commands.games.player_win_minesweeper'
          ),
          loseMessage: interaction.client.i18n.t(
            'commands.games.player_loose_minesweeper'
          ),
          playerOnlyMessage: interaction.client.i18n.t(
            'commands.games.player_only',
            {
              player: '{player}',
            }
          ),
        })

        game.startGame()
        break
      }
      case 'rock-paper-scissors': {
        const game = new RockPaperScissors({
          ...{
            message: interaction,
            isSlashGame: true,
            opponent: inputOpponent,
            embed: {
              title: 'Rock Paper Scissors',
              color: '#5865F2',
              description: interaction.client.i18n.t(
                'commands.games.click_buttons_below'
              ),
            },
            buttons: {
              rock: interaction.client.i18n.t('commands.games.rock'),
              paper: interaction.client.i18n.t('commands.games.paper'),
              scissors: interaction.client.i18n.t('commands.games.scissors'),
            },
            emojis: {
              rock: '🪨',
              paper: '📄',
              scissors: '✂️',
            },
            mentionUser: true,
            timeoutTime: 60000,
            buttonStyle: 'PRIMARY',
            pickMessage: interaction.client.i18n.t(
              'commands.games.player_pick',
              {
                emoji: '{emoji}',
              }
            ),
            winMessage: interaction.client.i18n.t(
              'commands.games.player_win_rps',
              {
                player: '{player}',
              }
            ),
            tieMessage: interaction.client.i18n.t('commands.games.tie_game'),
            timeoutMessage: interaction.client.i18n.t(
              'commands.games.timeout_game'
            ),
            playerOnlyMessage: interaction.client.i18n.t(
              'commands.games.player_only',
              {
                player: '{player}',
              }
            ),
          },
          ...approveOption,
        })

        game.startGame()
        break
      }
      case 'slots': {
        const game = new Slots({
          message: interaction,
          isSlashGame: true,
          embed: {
            title: 'Slot Machine',
            color: '#5865F2',
          },
          slots: ['🍇', '🍊', '🍋', '🍌'],
        })

        game.startGame()
        break
      }
      case 'snake': {
        const game = new Snake({
          message: interaction,
          isSlashGame: true,
          embed: {
            title: 'Snake Game',
            overTitle: interaction.client.i18n.t('commands.games.game_over'),
            color: '#5865F2',
          },
          emojis: {
            board: '⬛',
            food: '🍎',
            up: '⬆️',
            down: '⬇️',
            left: '⬅️',
            right: '➡️',
          },
          snake: { head: '🟢', body: '🟩', tail: '🟢', skull: '💀' },
          foods: ['🍎', '🍇', '🍊', '🫐', '🥕', '🥝', '🌽'],
          stopButton: interaction.client.i18n.t('commands.games.stop'),
          timeoutTime: 60000,
          playerOnlyMessage: interaction.client.i18n.t(
            'commands.games.player_only',
            {
              player: '{player}',
            }
          ),
        })

        game.startGame()
        break
      }
      case 'tic-tac-toe': {
        const game = new TicTacToe({
          ...{
            message: interaction,
            isSlashGame: true,
            opponent: inputOpponent,
            embed: {
              title: 'Tic Tac Toe',
              color: '#5865F2',
              statusTitle: interaction.client.i18n.t('commands.games.status'),
              overTitle: interaction.client.i18n.t('commands.games.stop'),
            },
            emojis: {
              xButton: '❌',
              oButton: '🔵',
              blankButton: '➖',
            },
            mentionUser: true,
            timeoutTime: 60000,
            xButtonStyle: 'DANGER',
            oButtonStyle: 'PRIMARY',
            turnMessage: interaction.client.i18n.t(
              'commands.games.turn_to_player',
              {
                emoji: '{emoji}',
                player: '{player}',
              }
            ),
            winMessage: interaction.client.i18n.t(
              'commands.games.player_win_tic_tac_toe',
              {
                emoji: '{emoji}',
                player: '{player}',
              }
            ),
            tieMessage: interaction.client.i18n.t('commands.games.tie_game'),
            timeoutMessage: interaction.client.i18n.t(
              'commands.games.timeout_game'
            ),
            playerOnlyMessage: interaction.client.i18n.t(
              'commands.games.player_only',
              {
                player: '{player}',
              }
            ),
          },
          ...approveOption,
        })

        game.startGame()
        break
      }
      case 'trivia': {
        const game = new Trivia({
          message: interaction,
          isSlashGame: true,
          embed: {
            title: 'Trivia',
            color: '#5865F2',
            description: interaction.client.i18n.t(
              'commands.games.player_have_time_to_answer'
            ),
          },
          timeoutTime: 60000,
          buttonStyle: 'PRIMARY',
          trueButtonStyle: 'SUCCESS',
          falseButtonStyle: 'DANGER',
          mode: inputMode,
          difficulty: inputDifficulty,
          winMessage: interaction.client.i18n.t(
            'commands.games.player_win_trivia',
            {
              answer: '{answer}',
            }
          ),
          loseMessage: interaction.client.i18n.t(
            'commands.games.player_loose_trivia',
            {
              answer: '{answer}',
            }
          ),
          errMessage: interaction.client.i18n.t(
            'commands.games.question_api_not_response'
          ),
          playerOnlyMessage: interaction.client.i18n.t(
            'commands.games.player_only',
            {
              player: '{player}',
            }
          ),
        })

        game.startGame()
        break
      }
      case 'wordle': {
        const game = new Wordle({
          message: interaction,
          isSlashGame: true,
          embed: {
            title: 'Wordle',
            color: '#5865F2',
          },
          customWord: null,
          timeoutTime: 60000,
          winMessage: interaction.client.i18n.t(
            'commands.games.player_win_wordle',
            {
              word: '{word}',
            }
          ),
          loseMessage: interaction.client.i18n.t(
            'commands.games.player_loose_wordle',
            {
              word: '{word}',
            }
          ),
          playerOnlyMessage: interaction.client.i18n.t(
            'commands.games.player_only',
            {
              player: '{player}',
            }
          ),
        })

        game.startGame()
        break
      }
      case 'would-you-rather': {
        const game = new WouldYouRather({
          message: interaction,
          isSlashGame: true,
          embed: {
            title: 'Would You Rather',
            color: '#5865F2',
          },
          buttons: {
            option1: interaction.client.i18n.t('commands.games.option_one'),
            option2: interaction.client.i18n.t('commands.games.option_two'),
          },
          timeoutTime: 60000,
          errMessage: interaction.client.i18n.t(
            'commands.games.question_api_not_response'
          ),
          playerOnlyMessage: interaction.client.i18n.t(
            'commands.games.player_only',
            {
              player: '{player}',
            }
          ),
        })

        game.startGame()
        break
      }
    }
  },
}
