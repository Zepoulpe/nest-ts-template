import { Logger } from '@nestjs/common';

export function LogExecutionTime(label?: string): MethodDecorator {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const start = Date.now();
      const logger = new Logger(target.constructor.name);

      try {
        const result = await originalMethod.apply(this, args);
        const duration = Date.now() - start;
        logger.debug(`${label || String(propertyKey)} executed in ${duration}ms`);
        return result;
      } catch (error) {
        const duration = Date.now() - start;
        logger.error(
          `${label || String(propertyKey)} failed after ${duration}ms: ${(error as Error).message}`,
        );
        throw error;
      }
    };

    return descriptor;
  };
}
