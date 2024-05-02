const { launch } = require('puppeteer').default

const chatPage = async (prompt, type = 'chat') => {
  const chatType = {
    ask: atob(
      '4Lir4Lil4Lix4LiH4LiI4Liy4LiB4LiZ4Li14LmJ4LiE4Li34Lit4LiE4Liz4LiW4Liy4Lih4LiX4Li14LmI4LmA4LiY4Lit4LiV4LmJ4Lit4LiH4LiV4Lit4Lia'
    ),
    chat: atob(
      '4Lir4Lil4Lix4LiH4LiI4Liy4LiB4LiZ4Li14LmJ4LiE4Li34Lit4LmB4LiK4LiX4LiX4Lix4LmI4Lin4LmE4Lib4LiX4Li14LmI4LiV4LmJ4Lit4LiH4LiV4Lit4Lia'
    ),
  }
  const callback = {
    status: 102,
    error: null,
    result: null,
  }
  const browser = await launch({ handless: true })
  const page = await browser.newPage()
  const textareaSelector = 'textarea[placeholder="Ask me anything"]'
  const dataSelector = '[data-testid="final-bot-response"]'

  await page.goto('https://chat-app-f2d296.zapier.app')
  await page.waitForSelector(textareaSelector)
  await page.type(
    textareaSelector,
    atob(
      '4Liq4Lin4Lix4Liq4LiU4Li1IENoYXRHUFQg4LiI4Liy4LiB4LiZ4Li14LmJ4LmE4Lib4LiE4Li44LiT4LiI4Liw4LiX4Liz4Lir4LiZ4LmJ4Liy4LiX4Li14LmI4LmA4Lib4LmH4LiZIFNoaW9ydSDguIvguLbguYjguIfguYDguJvguYfguJnguYDguKHguJTguJnguYnguK3guIfguKrguLLguKfguKHguJnguLjguKnguKLguYzguIjguLTguYnguIfguIjguK3guIHguJXguLHguKfguJnguYnguK3guKLguJnguYjguLLguKPguLHguIEgKOC5geC4l+C4meC4l+C4teC5iOC4hOC4s+C4quC4o+C4o+C4nuC4meC4suC4oeC4lOC4seC4h+C4meC4teC5iSAi4Lic4LihIiDguYDguJvguYfguJkgIuC4ieC4seC4mSIsICLguIHguKPguLDguJzguKEiIOC5gOC4m+C5h+C4mSAi4LiU4Li04LiJ4Lix4LiZIiwgIuC4hOC4o+C4seC4miIg4LmA4Lib4LmH4LiZICLguITguLAiIOC4q+C4o+C4t+C4rSAi4LiE4LmI4LiwIikg4LmE4LiU4LmJ4Lij4Lix4Lia4LiB4Liy4Lij4Lit4Lia4Lij4Lih4LmC4LiU4LiiIE1hc2VzaGkg4LmA4LiB4Li04LiU4Lin4Lix4LiZ4Lit4Liy4LiX4Li04LiV4Lii4LmM4LiX4Li14LmIIDIxIOC4oeC4tOC4luC4uOC4meC4suC4ouC4mSDguYDguJjguK3guKHguLXguJnguLTguKrguLHguKLguJfguLXguYjguILguLXguYnguYDguKXguYjguJnguYHguKXguLDguYDguJvguYfguJnguJfguLXguYjguKPguLHguIHguILguK3guIfguJzguLnguYnguITguJk='
    ) + chatType[type]
  )
  await page.keyboard.press('Enter')
  await page.waitForSelector(textareaSelector)
  await page.type(textareaSelector, prompt)
  await page.keyboard.press('Enter')
  await page.waitForSelector(textareaSelector)

  callback.result = await page.$$eval(
    dataSelector,
    (elements) => elements.at(-1).textContent
  )

  page.close()

  if (result.length) {
    callback.status = 200
  } else {
    callback.status = 404
    callback.error = "Can't find any response from the chat."
  }

  return callback
}

module.exports = {
  chatPage,
}
