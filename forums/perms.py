from permission.logics import AuthorPermissionLogic, StaffPermissionLogic

PERMISSION_LOGICS = (
    ('forums.Post', AuthorPermissionLogic(field_name='author',
                                          any_permission=False,
                                          change_permission=True,
                                          delete_permission=True,
                                          )
     ),
    ('forums.Post', StaffPermissionLogic(
        any_permission=False,
        change_permission=True,
        delete_permission=True,
    )
     )
)
