import { TaroPlatformBase } from '@tarojs/shared'
import { Template } from './template'
import { components } from './components'

export default class Weapp extends TaroPlatformBase {
  platform = 'weapp'
  globalObject = 'wx'
  projectConfigJson = 'project.config.json'
  fileType = {
    templ: '.wxml',
    style: '.wxss',
    config: '.json',
    script: '.js',
    xs: '.wxs'
  }

  template = new Template()

  /**
   * 调用 mini-runner 开启编译
   */
  async start () {
    this.setup()
    this.generateProjectConfig(this.projectConfigJson)
    this.modifyComponents()
    this.modifyWebpackChain()

    const runner = await this.getRunner()
    const options = this.getBaseOptions()
    runner(options)
  }

  /**
   * 增加组件或修改组件属性
   */
  modifyComponents () {
    const { internalComponents } = this.template
    const { recursiveMerge } = this.ctx.helper

    recursiveMerge(internalComponents, components)

    this.template.voidElements.add('voip-room')
  }

  /**
   * 修改 webpack 配置
   */
  modifyWebpackChain () {
    this.ctx.modifyWebpackChain(({ chain }) => {
      const { taroJsComponents } = this.helper
      chain.resolve.alias.set(taroJsComponents + '$', '@tarojs/plugin-platform-weapp/dist/components-react.js')
    })
  }
}
