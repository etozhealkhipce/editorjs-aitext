import Paragraph from '@editorjs/paragraph'
import {
  TAITextApi,
  TAITextCSS,
  TAITextCallback,
  TAITextConstructor,
  TAITextData,
  TAITextElement,
  TAITextReadOnly
} from '../aitext'
import { debounce } from './lib'

const DEFAULT_ICON = `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 4V20M17 12V20M6 20H10M15 20H19M13 7V4H3V7M21 14V12H13V14" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`

const DEFAULT_LOADER_ICON = `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2.99988V5.99988M12 20.9999V17.9999M4.20577 16.4999L6.80385 14.9999M21 11.9999H18M16.5 19.7941L15 17.196M3 11.9999H6M7.5 4.20565L9 6.80373M7.5 19.7941L9 17.196M19.7942 16.4999L17.1962 14.9999M4.20577 7.49988L6.80385 8.99988" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`

class AIText extends Paragraph {
  private static _icon: string = DEFAULT_ICON

  private callback: TAITextCallback
  private _element: TAITextElement
  private _CSS: TAITextCSS
  private _data: TAITextData
  private readOnly: TAITextReadOnly = false
  private api: TAITextApi
  private acceptKeys: string[]
  private declineKeys: string[]
  private debounceTimeout: number
  private loaderIcon: string
  onInput: ReturnType<typeof debounce>

  static get toolbox() {
    return {
      title: 'AI TEXT',
      icon: AIText._icon
    }
  }

  static prepare({ config }: { config: { icon?: string } }) {
    if (config?.icon) {
      AIText._icon = config.icon
    }
  }

  constructor({ api, block, config, data }: TAITextConstructor) {
    super({
      api,
      block,
      config,
      data
    })

    if (!config.callback) {
      throw new Error('Callback function is required!')
    }

    this.callback = config.callback
    this.acceptKeys = config.acceptKeys ?? ['AltLeft', 'AltRight', 'Tab']
    this.declineKeys = config.declineKeys ?? ['Escape', 'Backspace']
    this.debounceTimeout = config.debounceTimeout ?? 2000

    const overlap = this.acceptKeys.filter(k => this.declineKeys.includes(k))
    if (overlap.length) {
      console.warn(`AIText: keys [${overlap.join(', ')}] are in both acceptKeys and declineKeys`)
    }
    this.loaderIcon = config.loaderIcon ?? DEFAULT_LOADER_ICON
    AIText._icon = config.icon ?? DEFAULT_ICON

    this.onInput = debounce((e) => {
      if (
        this._element?.querySelector('#ai-suggestions') ||
        e.inputType === 'deleteContentBackward' ||
        e.inputType === 'deleteContentForward' ||
        e.inputType === 'insertParagraph' ||
        e.inputType === 'insertFromPaste' ||
        e.inputType === 'insertFromDrop' ||
        !e.target.innerHTML
      ) {
        return
      }
      this.getAICompletion(e.target.innerHTML)
    }, this.debounceTimeout)
  }

  getAICompletion(content: string) {
    if (!content) return

    const loaderElement = document.createElement('div')
    loaderElement.innerHTML = this.loaderIcon
    loaderElement.id = 'ai-suggestions-loader'

    loaderElement.style.display = 'inline-flex'
    loaderElement.style.alignItems = 'center'
    loaderElement.style.width = '24px'
    loaderElement.style.height = '24px'
    loaderElement.style.paddingLeft = '4px'
    loaderElement.style.color = 'lightgray'
    loaderElement.style.position = 'absolute'

    loaderElement.animate(
      [
        {
          transform: 'rotate(0deg)'
        },
        {
          transform: 'rotate(360deg)'
        }
      ],
      {
        duration: 2000,
        iterations: Infinity
      }
    )

    this._element?.appendChild(loaderElement)

    this.callback?.(content)
      .then((response) => {
        const aiSuggestions = document.createElement('span')
        aiSuggestions.innerHTML = ''
        aiSuggestions.id = 'ai-suggestions'
        aiSuggestions.style.color = 'lightgray'
        aiSuggestions.innerHTML = response

        this._element?.appendChild(aiSuggestions)

        this._element?.querySelector('#ai-suggestions-loader')?.remove()
      })
      .catch((error) => {
        throw new Error(error)
      })
  }


  private isAcceptKey(code: string): boolean {
    return this.acceptKeys.includes(code)
  }

  private isDeclineKey(code: string): boolean {
    return this.declineKeys.includes(code)
  }

  private applySuggestion(aiSuggestionElement: Element) {
    const text = aiSuggestionElement.textContent
    if (!text) return
    this._element?.appendChild(document.createTextNode(text))
    aiSuggestionElement.remove()
    this.moveCursorToEnd()
  }

  private moveCursorToEnd() {
    if (!this._element) return
    const range = document.createRange()
    const sel = window.getSelection()
    range.selectNodeContents(this._element)
    range.collapse(false)
    sel?.removeAllRanges()
    sel?.addRange(range)
  }

  onKeyDown = (e: KeyboardEvent) => {
    if (!this.isAcceptKey(e.code)) return

    const aiSuggestionElement = this._element?.querySelector('#ai-suggestions')
    if (!aiSuggestionElement?.textContent) return

    e.preventDefault()
    e.stopPropagation()
    this.applySuggestion(aiSuggestionElement)
  }

  onKeyUp = (e: KeyboardEvent) => {
    if (this.isDeclineKey(e.code) || e.code === 'Backspace') {
      this._element?.querySelector('#ai-suggestions')?.remove()
      return
    }

    if ((e.code !== 'Backspace' && e.code !== 'Delete') || !this._element) {
      return
    }

    const { textContent } = this._element
    if (textContent === '') {
      this._element.innerHTML = ''
    }
  }

  drawView() {
    const div = document.createElement('DIV')

    div.classList.add(this._CSS.wrapper, this._CSS.block)
    div.contentEditable = 'false'
    div.dataset.placeholder = this.api.i18n.t(this._placeholder)

    if (this._data.text) {
      div.innerHTML = this._data.text
    }

    if (!this.readOnly) {
      div.contentEditable = 'true'
      div.addEventListener('keydown', this.onKeyDown)
      div.addEventListener('keyup', this.onKeyUp)
      div.addEventListener('input', this.onInput)
    }

    return div
  }

  private _placeholder(_placeholder: any): string | undefined {
    throw new Error('Method not implemented.')
  }
}

export default AIText
