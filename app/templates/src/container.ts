import path from 'path'
import { createContainer, asClass, InjectionMode, Lifetime, AwilixContainer } from 'awilix'

export const initContainer = async (): Promise<AwilixContainer> => {
  const container: AwilixContainer = createContainer({
    injectionMode: InjectionMode.CLASSIC,
  })

  container.loadModules(['./web/rest/*Controller.{js,ts}', './domain/usecase/*Service.{js,ts}'], {
    formatName: 'camelCase',
    cwd: path.resolve(__dirname),
    resolverOptions: {
      lifetime: Lifetime.SINGLETON,
      register: asClass,
    },
  })

  // eslint-disable-next-line no-console
  console.log(container)

  return container
}
