import { useEffect, useState } from 'react';
import { useConfigStore } from '../../store/config/configStore';
import HeadPage from '../../components/HeadPage';
import { notifications } from '@mantine/notifications';
import {
  Card,
  Text,
  TextInput,
  Button,
  Group,
  Stack,
  ColorInput,
  LoadingOverlay,
  Paper,
  Title,
  Badge,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconDeviceFloppy, IconRefresh } from '@tabler/icons-react';

const Config = () => {
  const {
    version,
    banner,
    loading,
    getVersion,
    updateVersion,
    getBanner,
    updateBanner,
    errors,
    clearError,
  } = useConfigStore();

  const [isInitialized, setIsInitialized] = useState(false);

  const versionForm = useForm({
    initialValues: {
      version: '',
    },
    validate: {
      version: (value) => (!value ? 'La versión es requerida' : null),
    },
  });

  const bannerForm = useForm({
    initialValues: {
      link: '',
      background: '#FFFFFF',
      image: '',
    },
    validate: {
      link: (value) => (!value ? 'El enlace es requerido' : null),
      background: (value) => (!value ? 'El color de fondo es requerido' : null),
      image: (value) => (!value ? 'La imagen es requerida' : null),
    },
  });

  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([getVersion(), getBanner()]);
      } catch (error) {
        console.error('Error al cargar la configuración:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    if (!isInitialized) {
      initializeData();
    }
  }, [isInitialized, getVersion, getBanner]);

  useEffect(() => {
    if (version) {
      versionForm.setValues({
        version: version.app.version,
      });
    }
  }, [version]);

  useEffect(() => {
    if (banner) {
      bannerForm.setValues({
        link: banner.link,
        background: banner.background,
        image: banner.image,
      });
    }
  }, [banner]);

  useEffect(() => {
    if (errors.length > 0) {
      errors.forEach((error) => {
        notifications.show({
          title: 'Error',
          message: error,
          color: 'red',
        });
      });
      clearError();
    }
  }, [errors, clearError]);

  const handleUpdateVersion = async (values: { version: string }) => {
    try {
      await updateVersion({ version: values.version });
      notifications.show({
        title: 'Éxito',
        message: 'Versión actualizada correctamente',
        color: 'green',
      });
    } catch (error) {
      console.error('Error al actualizar la versión:', error);
    }
  };

  const handleUpdateBanner = async (values: {
    link: string;
    background: string;
    image: string;
  }) => {
    try {
      await updateBanner(values);
      notifications.show({
        title: 'Éxito',
        message: 'Banner actualizado correctamente',
        color: 'green',
      });
    } catch (error) {
      console.error('Error al actualizar el banner:', error);
    }
  };

  const handleRefresh = async () => {
    try {
      await Promise.all([getVersion(), getBanner()]);
      notifications.show({
        title: 'Éxito',
        message: 'Configuración actualizada',
        color: 'green',
      });
    } catch (error) {
      console.error('Error al refrescar la configuración:', error);
    }
  };

  return (
    <>
      <HeadPage
        title="Configuración"
        beforePath={[{ title: 'Dashboard', path: '/dashboard' }]}
      />
      <LoadingOverlay visible={!isInitialized} />
      
      <Stack spacing="lg">
        {/* Botón de refrescar */}
        <Group position="right">
          <Button
            variant="light"
            onClick={handleRefresh}
            loading={loading.getVersion || loading.getBanner}
          >
            <IconRefresh size={16} />
            Refrescar
          </Button>
        </Group>

        {/* Configuración de Versión */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack spacing="md">
            <Group position="apart" align="center">
              <div>
                <Title order={3}>Versión de la Aplicación</Title>
                <Text size="sm" color="dimmed">
                  Configura la versión actual de la aplicación
                </Text>
              </div>
              {version && (
                <Badge variant="light" color="blue">
                  Actual: {version.app.version}
                </Badge>
              )}
            </Group>
            
            <form onSubmit={versionForm.onSubmit(handleUpdateVersion)}>
              <Stack spacing="md">
                <TextInput
                  label="Versión"
                  placeholder="Ej: 1.0.0"
                  required
                  {...versionForm.getInputProps('version')}
                />
                
                <Group position="right">
                  <Button
                    type="submit"
                    loading={loading.updateVersion}
                  >
                    <IconDeviceFloppy size={16} />
                    Actualizar Versión
                  </Button>
                </Group>
              </Stack>
            </form>
          </Stack>
        </Card>

        {/* Configuración de Banner */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack spacing="md">
            <div>
              <Title order={3}>Banner de la Aplicación</Title>
              <Text size="sm" color="dimmed">
                Configura el banner que se mostrará en la aplicación
              </Text>
            </div>
            
            <form onSubmit={bannerForm.onSubmit(handleUpdateBanner)}>
              <Stack spacing="md">
                <TextInput
                  label="Enlace del Banner"
                  placeholder="https://ejemplo.com"
                  required
                  {...bannerForm.getInputProps('link')}
                />
                
                <ColorInput
                  label="Color de Fondo"
                  placeholder="#FFFFFF"
                  required
                  {...bannerForm.getInputProps('background')}
                />
                
                <TextInput
                  label="URL de la Imagen"
                  placeholder="https://ejemplo.com/banner.png"
                  required
                  {...bannerForm.getInputProps('image')}
                />

                {/* Vista previa del banner */}
                {bannerForm.values.image && (
                  <Paper p="md" withBorder>
                    <Text size="sm" weight={500} mb="xs">
                      Vista Previa del Banner:
                    </Text>
                    <div
                      style={{
                        background: bannerForm.values.background,
                        padding: '1rem',
                        borderRadius: '8px',
                        textAlign: 'center',
                      }}
                    >
                      <img
                        src={bannerForm.values.image}
                        alt="Vista previa del banner"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '200px',
                          objectFit: 'contain',
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <Text size="sm" mt="xs">
                        Enlace: {bannerForm.values.link}
                      </Text>
                    </div>
                  </Paper>
                )}
                
                <Group position="right">
                  <Button
                    type="submit"
                    loading={loading.updateBanner}
                  >
                    <IconDeviceFloppy size={16} />
                    Actualizar Banner
                  </Button>
                </Group>
              </Stack>
            </form>
          </Stack>
        </Card>
      </Stack>
    </>
  );
};

export default Config; 