import { FormEvent, memo, ReactNode, useCallback } from "react";
import { Form, useFetcher, useRouteLoaderData } from "react-router-dom";
import useActionError from "../../hooks/ActionErrorHook";
import type { ActionFuncError } from "../../models/entity";
import { dashboardLoader } from "../../utils/loaders";


interface DuplicateFormTypes
{
  inputName: 'projectID' | 'taskID' | 'subTaskID';
  inputValue: string;
  closeMenu: () => void;
  children: ReactNode;
}

function DuplicateForm({ inputName, inputValue, closeMenu, children }: DuplicateFormTypes)
{
  const data = useRouteLoaderData<typeof dashboardLoader>('project-root');
  const user = data?.user;
  const fetcher = useFetcher();
  useActionError(fetcher.data as ActionFuncError);

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const handleOnSubmit = useCallback((e: FormEvent<HTMLFormElement>) =>
  {
    e.preventDefault();
    fetcher
      .submit(e.currentTarget, { method: 'POST', action: `/projects/${user?.username ?? ''}` })
      .then(closeMenu)
      .catch((error: unknown) => { console.error('Error form failed to submit: ', error) });
  }, [closeMenu, fetcher, user?.username]);

  if (!user) return null;

  return (
    <Form method="post" action={`/projects/${user.username}`} onSubmit={handleOnSubmit}>
      <input type="hidden" name={inputName} defaultValue={inputValue} />
      <input type="hidden" name="intent" defaultValue={'duplicate'} />
      {children}
    </Form>)
}

export default memo(DuplicateForm);